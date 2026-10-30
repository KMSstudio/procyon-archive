/* @/repository/chatRepository.js */

import "server-only";

import { randomUUID } from "node:crypto";
import { FieldPath } from "firebase-admin/firestore";
import { db } from "@/utils/database/firebase";
import { redis } from "@/utils/database/redis";

/**
 * @typedef {import("@/utils/chat/types").Chat} Chat
 * @typedef {import("@/utils/chat/types").ChatRoom} ChatRoom
 * @typedef {import("@/utils/chat/types").MessageCursor} MessageCursor
 * @typedef {import("@/utils/chat/types").MessageQuery} MessageQuery
 * @typedef {import("@/utils/chat/types").MessagePage} MessagePage
 * @typedef {import("@/utils/chat/types").RecentSnapshot} RecentSnapshot
 * @typedef {import("@/utils/chat/types").TimeRange} TimeRange
 * @typedef {import("@/utils/chat/types").DeleteResult} DeleteResult
 */

const rooms = db.collection(process.env.FIRE_DB_CHAT_TABLE);
const RECENT_LIMIT = Math.max(1, Number(process.env.CHAT_RECENT_LIMIT) || 100);
const CACHE_TTL = Math.max(1, Number(process.env.TTL_CHAT_CACHE) || 60);
const MAX_LIMIT = 100;
const BATCH_SIZE = 400;
const VERSION = "v1";
const ROOMS_KEY = "chat:rooms";
const TIME_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/;

/* ===== Common Helpers ===== */

export function isValidRoomId(id) { return typeof id === "string" && /^[a-zA-Z0-9_-]{1,50}$/.test(id); }
function assertRoomId(id) { if (!isValidRoomId(id)) { throw new TypeError("Invalid roomId"); } }
function assertMessageId(id) { if (typeof id !== "string" || !id || id.includes("/") || id.length > 256) { throw new TypeError("Invalid messageId"); } }
function cleanText(value) { return typeof value === "string" ? value.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "") : value ?? ""; }
function nowKST() { return new Date(Date.now() + 9 * 3600000).toISOString().replace("T", " ").slice(0, 23); }
function serialize(value) { return JSON.parse(JSON.stringify(value)); }
function roomRef(roomId) { return rooms.doc(roomId); }
function messagesRef(roomId) { return roomRef(roomId).collection("messages"); }
function roomKey(roomId) { return `chat:room:${encodeURIComponent(roomId)}`; }
function recentKey(roomId) { return `${roomKey(roomId)}:recent:v2`; }
function latestKey(roomId) { return `${roomKey(roomId)}:latest`; }
function generationKey(key) { return `${key}:generation`; }
function normDocs(snapshot) { return snapshot.docs.map(doc => normMsg(doc.id, doc.data())); }
function messageOrder(query, direction = "asc") { return query.orderBy("createdAt", direction).orderBy(FieldPath.documentId(), direction); }
function compareMessages(a, b) { return a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id); }

function parseLimit(value) {
  if (value == null) { return Math.min(RECENT_LIMIT, MAX_LIMIT); }
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) { throw new TypeError("Invalid limit"); }
  return limit;
}

/**
 * Validates a timestamp in the existing KST string format.
 * @param {string} value
 * @returns {string}
 */
function validateTime(value) {
  if (typeof value !== "string" || !TIME_PATTERN.test(value)) { throw new TypeError("Invalid timestamp"); }
  const parsed = new Date(value.replace(" ", "T") + "+09:00");
  if (!Number.isFinite(parsed.getTime())) { throw new TypeError("Invalid timestamp"); }
  const normalized = new Date(parsed.getTime() + 9 * 3600000).toISOString().replace("T", " ").slice(0, 23);
  if (normalized !== value) { throw new TypeError("Invalid timestamp"); }
  return value;
}

/**
 * Normalizes current and legacy Firestore messages.
 * @param {string|null} id
 * @param {Object} data
 * @returns {Chat}
 */
function normMsg(id, data = {}) {
  const sender = data.sender || { email: data.senderEmail, name: data.senderName, major: data.senderMajor || data.major };
  return {
    version: VERSION, id: id || data.id || null, text: cleanText(data.text), createdAt: data.createdAt || null,
    sender: { email: cleanText(sender?.email), name: cleanText(sender?.name), major: cleanText(sender?.major) },
  };
}

/* ===== Composite Cursor ===== */

/**
 * Encodes a message position into a Base64URL cursor.
 * @param {Chat|MessageCursor} message
 * @returns {string}
 */
export function encodeMessageCursor(message) {
  if (!message) { throw new TypeError("Invalid cursor message"); }
  validateTime(message.createdAt);
  assertMessageId(message.id);
  return Buffer.from(JSON.stringify({ createdAt: message.createdAt, id: message.id })).toString("base64url");
}

/**
 * Decodes and validates a composite cursor.
 * @param {string} cursor
 * @returns {MessageCursor}
 */
export function decodeMessageCursor(cursor) {
  if (typeof cursor !== "string" || !/^[A-Za-z0-9_-]{1,512}$/.test(cursor)) { throw new TypeError("Invalid cursor"); }
  try {
    const data = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
    if (!data || Array.isArray(data) || Object.keys(data).sort().join(",") !== "createdAt,id") { throw new Error(); }
    validateTime(data.createdAt);
    assertMessageId(data.id);
    return data;
  } catch { throw new TypeError("Invalid cursor"); }
}

/**
 * Builds a message page with composite cursors.
 * @param {Chat[]} messages
 * @param {boolean} hasMore
 * @returns {MessagePage}
 */
function makePage(messages, hasMore) {
  return {
    messages, hasMore,
    cursor: {
      oldest: messages.length ? encodeMessageCursor(messages[0]) : null,
      latest: messages.length ? encodeMessageCursor(messages[messages.length - 1]) : null,
    },
  };
}

/* ===== Redis Cache ===== */

async function redisGet(key) {
  try { return { ok: true, value: await redis.get(key) }; }
  catch (error) { console.warn(`Redis GET failed (${key}):`, error); return { ok: false, value: null }; }
}

async function redisSet(key, value, options) {
  try { await redis.set(key, value, options); return true; }
  catch (error) { console.warn(`Redis SET failed (${key}):`, error); return false; }
}

async function redisDelete(...keys) {
  try { await redis.del(...keys); return true; }
  catch (error) { console.warn("Redis DEL failed:", error); return false; }
}

async function cacheGeneration(key) {
  const result = await redisGet(generationKey(key));
  if (!result.ok) { return null; }
  return result.value || "initial";
}

/**
 * Invalidates cache entries by rotating their generations.
 * @param {...string} keys
 * @returns {Promise<boolean>}
 */
async function invalidateKeys(...keys) {
  const results = await Promise.all([...new Set(keys)].map(async key => {
    const rotated = await redisSet(generationKey(key), randomUUID());
    const deleted = await redisDelete(key);
    return rotated && deleted;
  }));
  return results.every(Boolean);
}

/**
 * Reads cached data only when its generation remains consistent.
 * @param {string} key
 * @returns {Promise<any|null>}
 */
async function cacheRead(key) {
  const before = await cacheGeneration(key);
  if (before === null) { return null; }

  const result = await redisGet(key);
  if (!result.ok || !result.value || typeof result.value !== "object") { return null; }

  const after = await cacheGeneration(key);
  if (after === null || before !== after || result.value.generation !== after) { return null; }
  return result.value.data;
}

/**
 * Loads data from Redis or falls back to Firestore.
 * @param {string} key
 * @param {() => Promise<any>} loader
 * @returns {Promise<any>}
 */
async function cacheLoad(key, loader) {
  const cached = await cacheRead(key);
  if (cached !== null) { return cached; }

  const generation = await cacheGeneration(key);
  const data = await loader();

  if (generation !== null && generation === await cacheGeneration(key)) {
    await redisSet(key, { generation, data }, { ex: CACHE_TTL });
  }
  return data;
}

/**
 * Invalidates room metadata and message caches.
 * @param {string} roomId
 * @returns {Promise<boolean>}
 */
export async function invalidateMessageCache(roomId) {
  assertRoomId(roomId);
  return invalidateKeys(ROOMS_KEY, roomKey(roomId), recentKey(roomId), latestKey(roomId));
}

/* ===== Room Repository ===== */

/**
 * Retrieves a chat room using Redis with Firestore fallback.
 * @param {string} roomId
 * @returns {Promise<ChatRoom|null>}
 */
export async function fetchRoom(roomId) {
  assertRoomId(roomId);
  return cacheLoad(roomKey(roomId), async () => {
    const doc = await roomRef(roomId).get();
    return doc.exists ? serialize({ id: doc.id, ...doc.data() }) : null;
  });
}

export async function isRoomExist(roomId) {
  if (!isValidRoomId(roomId)) { return false; }
  return (await fetchRoom(roomId)) !== null;
}

/**
 * Retrieves all chat rooms ordered by update time.
 * @returns {Promise<ChatRoom[]>}
 */
export async function fetchAllRooms() {
  return cacheLoad(ROOMS_KEY, async () => {
    const snapshot = await rooms.orderBy("updatedAt", "desc").get();
    return serialize(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

/**
 * Creates or updates a chat room.
 * @param {string} roomId
 * @param {Partial<Omit<ChatRoom, "id" | "_messageDeletion">>} data
 * @returns {Promise<ChatRoom>}
 */
export async function upsertRoom(roomId, data = {}) {
  assertRoomId(roomId);
  const ref = roomRef(roomId);
  const now = nowKST();
  const { id: _id, _messageDeletion: _deletion, ...patch } = data;

  await invalidateMessageCache(roomId);
  try {
    await db.runTransaction(async tx => {
      const existing = await tx.get(ref);
      const createdAt = existing.exists ? existing.data().createdAt || now : data.createdAt || now;
      tx.set(ref, { ...patch, roomName: cleanText(data.roomName || roomId), createdAt, updatedAt: now }, { merge: true });
    });
  } finally { await invalidateMessageCache(roomId); }

  return fetchRoom(roomId);
}

/* ===== Message Cache ===== */

/**
 * Loads recent messages and checks whether older messages exist.
 * @param {string} roomId
 * @returns {Promise<RecentSnapshot>}
 */
async function loadRecentSnapshot(roomId) {
  const snapshot = await messageOrder(messagesRef(roomId), "desc").limit(RECENT_LIMIT + 1).get();
  const hasOlder = snapshot.size > RECENT_LIMIT;
  const messages = normDocs({ docs: snapshot.docs.slice(0, RECENT_LIMIT) }).reverse();
  return { messages, hasOlder };
}

async function fetchRecentSnapshot(roomId) { return cacheLoad(recentKey(roomId), () => loadRecentSnapshot(roomId)); }

/**
 * Extracts a complete message page from the recent-message cache.
 * @param {RecentSnapshot} snapshot
 * @param {{after?: MessageCursor|null, limit: number}} options
 * @returns {MessagePage|null}
 */
function pageFromRecent(snapshot, { after, limit }) {
  const messages = snapshot.messages;

  if (!after) {
    const selected = messages.slice(-limit);
    return makePage(selected, messages.length > limit || snapshot.hasOlder);
  }
  if (!messages.length) { return makePage([], false); }

  const oldest = messages[0];
  const newest = messages[messages.length - 1];

  if (snapshot.hasOlder && compareMessages(after, oldest) < 0) { return null; }
  if (compareMessages(after, newest) >= 0) { return makePage([], false); }

  const matching = messages.filter(msg => compareMessages(msg, after) > 0);
  return makePage(matching.slice(0, limit), matching.length > limit);
}

/**
 * Queries Firestore messages using decoded composite cursors.
 * @param {string} roomId
 * @param {{before?: MessageCursor|null, after?: MessageCursor|null, limit: number}} options
 * @returns {Promise<MessagePage>}
 */
async function queryMessages(roomId, { before, after, limit }) {
  const direction = after ? "asc" : "desc";
  let query = messageOrder(messagesRef(roomId), direction);

  if (before || after) {
    const cursor = before || after;
    query = query.startAfter(cursor.createdAt, cursor.id);
  }

  const snapshot = await query.limit(limit + 1).get();
  const hasMore = snapshot.size > limit;
  const messages = normDocs({ docs: snapshot.docs.slice(0, limit) });
  if (direction === "desc") { messages.reverse(); }
  return makePage(messages, hasMore);
}

/* ===== Message Read ===== */

/**
 * Retrieves an individual chat message.
 * @param {string} roomId
 * @param {string} messageId
 * @returns {Promise<Chat|null>}
 */
export async function fetchMessage(roomId, messageId) {
  assertRoomId(roomId);
  assertMessageId(messageId);
  const doc = await messagesRef(roomId).doc(messageId).get();
  return doc.exists ? normMsg(doc.id, doc.data()) : null;
}

/**
 * Retrieves messages using composite cursors and Redis caching.
 * @param {string} roomId
 * @param {MessageQuery} options
 * @returns {Promise<MessagePage>}
 */
export async function fetchMessagesByCursor(roomId, { before, after, limit: requestedLimit } = {}) {
  assertRoomId(roomId);
  if (before != null && after != null) { throw new TypeError("before and after cannot be combined"); }

  const limit = parseLimit(requestedLimit);
  const beforeCursor = before == null ? null : decodeMessageCursor(before);
  const afterCursor = after == null ? null : decodeMessageCursor(after);

  if (beforeCursor) { return queryMessages(roomId, { before: beforeCursor, limit }); }
  if (limit > RECENT_LIMIT) { return queryMessages(roomId, { after: afterCursor, limit }); }

  const snapshot = await fetchRecentSnapshot(roomId);
  const cachedPage = pageFromRecent(snapshot, { after: afterCursor, limit });
  if (cachedPage !== null) { return cachedPage; }
  return queryMessages(roomId, { after: afterCursor, limit });
}

/* ===== Legacy Read Compatibility ===== */

/**
 * Retrieves messages using legacy timestamp-only cursors.
 * @param {string} roomId
 * @param {MessageQuery} options
 * @returns {Promise<Chat[]>}
 */
export async function fetchMessagesByTime(roomId, { before, after, limit: requestedLimit } = {}) {
  assertRoomId(roomId);
  if (before && after) { throw new TypeError("before and after cannot be combined"); }

  const limit = parseLimit(requestedLimit);
  if (!before && !after) { return (await fetchMessagesByCursor(roomId, { limit })).messages; }

  let query = messagesRef(roomId);
  if (before) { query = messageOrder(query.where("createdAt", "<", validateTime(before)), "desc"); }
  else { query = messageOrder(query.where("createdAt", ">", validateTime(after)), "asc"); }

  const messages = normDocs(await query.limit(limit).get());
  return before ? messages.reverse() : messages;
}

export async function fetchMessages(roomId, limit = RECENT_LIMIT) { return fetchMessagesByTime(roomId, { limit }); }

/* ===== Metadata ===== */

/**
 * Recalculates room metadata from the newest remaining message.
 * @param {string} roomId
 * @returns {Promise<void>}
 */
async function recalculateRoomMetadata(roomId) {
  const ref = roomRef(roomId);
  await db.runTransaction(async tx => {
    const room = await tx.get(ref);
    if (!room.exists) { return; }

    const latest = await tx.get(messageOrder(messagesRef(roomId), "desc").limit(1));
    const message = latest.empty ? null : normMsg(latest.docs[0].id, latest.docs[0].data());

    tx.update(ref, {
      lastMessage: message?.text || "",
      lastMessageSenderName: message?.sender.name || "",
      lastMessageCreatedAt: message?.createdAt || null,
    });
  });
}

/* ===== Deletion Coordination ===== */

export class RoomDeletingError extends Error { constructor(roomId) { super(`Message deletion is in progress for room ${roomId}`); this.name = "RoomDeletingError"; } }

/**
 * Marks a room as deleting to block concurrent message writes.
 * @param {string} roomId
 * @returns {Promise<string>}
 */
async function beginDeletion(roomId) {
  const ref = roomRef(roomId);
  const token = randomUUID();

  await db.runTransaction(async tx => {
    const room = await tx.get(ref);
    if (!room.exists) { throw new Error("Room not found"); }
    if (room.data()._messageDeletion) { throw new RoomDeletingError(roomId); }
    tx.update(ref, { _messageDeletion: { token, startedAt: nowKST() } });
  });

  return token;
}

/**
 * Finalizes bulk deletion and updates room metadata.
 * @param {string} roomId
 * @param {string} token
 * @returns {Promise<void>}
 */
async function finishDeletion(roomId, token) {
  const ref = roomRef(roomId);

  await db.runTransaction(async tx => {
    const room = await tx.get(ref);
    if (!room.exists) { return; }
    if (room.data()._messageDeletion?.token !== token) { throw new Error("Deletion ownership lost"); }

    const latest = await tx.get(messageOrder(messagesRef(roomId), "desc").limit(1));
    const message = latest.empty ? null : normMsg(latest.docs[0].id, latest.docs[0].data());

    tx.update(ref, {
      _messageDeletion: null,
      lastMessage: message?.text || "",
      lastMessageSenderName: message?.sender.name || "",
      lastMessageCreatedAt: message?.createdAt || null,
    });
  });
}

/* ===== Message Write ===== */

/**
 * Saves a message and updates room metadata in a Firestore transaction.
 * @param {string} roomId
 * @param {Pick<Chat, "text" | "sender">} data
 * @returns {Promise<Chat>}
 */
export async function saveMessage(roomId, data) {
  assertRoomId(roomId);
  if (typeof data?.text !== "string" || !data.text.trim() || !data.sender?.email) { throw new TypeError("Invalid message"); }

  const ref = messagesRef(roomId).doc();
  const now = nowKST();
  const message = normMsg(ref.id, { version: VERSION, text: data.text, createdAt: now, sender: data.sender });
  const { id: _, ...payload } = message;

  await invalidateMessageCache(roomId);
  try {
    await db.runTransaction(async tx => {
      const room = await tx.get(roomRef(roomId));
      if (!room.exists) { throw new Error("Room not found"); }
      if (room.data()._messageDeletion) { throw new RoomDeletingError(roomId); }

      tx.create(ref, payload);
      const previous = room.data().lastMessageCreatedAt;

      if (!previous || now >= previous) {
        tx.update(roomRef(roomId), {
          updatedAt: now, lastMessage: message.text,
          lastMessageSenderName: message.sender.name, lastMessageCreatedAt: now,
        });
      } else { tx.update(roomRef(roomId), { updatedAt: now }); }
    });
  } finally { await invalidateMessageCache(roomId); }

  return message;
}

/* ===== Single Message Deletion ===== */

/**
 * Deletes an individual message and recalculates room metadata.
 * @param {string} roomId
 * @param {string} messageId
 * @returns {Promise<DeleteResult>}
 */
export async function deleteMessage(roomId, messageId) {
  assertRoomId(roomId);
  assertMessageId(messageId);

  const ref = messagesRef(roomId).doc(messageId);
  let deletedCount = 0;

  await invalidateMessageCache(roomId);
  try {
    await db.runTransaction(async tx => {
      const room = await tx.get(roomRef(roomId));
      if (!room.exists) { throw new Error("Room not found"); }
      if (room.data()._messageDeletion) { throw new RoomDeletingError(roomId); }

      const doc = await tx.get(ref);
      if (!doc.exists) { return; }

      tx.delete(ref);
      tx.update(roomRef(roomId), { updatedAt: nowKST() });
      deletedCount = 1;
    });

    if (deletedCount) { await recalculateRoomMetadata(roomId); }
    return { deletedCount };
  } finally { await invalidateMessageCache(roomId); }
}

/* ===== Bulk Deletion ===== */

/**
 * Deletes matching messages in batches while blocking concurrent writes.
 * @param {string} roomId
 * @param {(ref: FirebaseFirestore.CollectionReference) => FirebaseFirestore.Query} buildQuery
 * @returns {Promise<number>}
 */
async function deleteMatching(roomId, buildQuery) {
  const token = await beginDeletion(roomId);
  let deletedCount = 0;
  let completed = false;

  await invalidateMessageCache(roomId);
  try {
    while (true) {
      const snapshot = await buildQuery(messagesRef(roomId)).limit(BATCH_SIZE).get();
      if (snapshot.empty) { break; }

      const batch = db.batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      deletedCount += snapshot.size;
    }

    await finishDeletion(roomId, token);
    completed = true;
    return deletedCount;
  } finally {
    await invalidateMessageCache(roomId);
    if (!completed) { console.error(`Bulk deletion interrupted for room ${roomId}, token=${token}`); }
  }
}

/**
 * Deletes messages within the half-open time range [from, to).
 * @param {string} roomId
 * @param {TimeRange} range
 * @returns {Promise<number>}
 */
export async function deleteMessagesByTime(roomId, { from, to } = {}) {
  assertRoomId(roomId);
  validateTime(from);
  validateTime(to);
  if (from >= to) { throw new TypeError("from must be earlier than to"); }

  return deleteMatching(roomId, ref => ref
    .where("createdAt", ">=", from).where("createdAt", "<", to)
    .orderBy("createdAt", "asc").orderBy(FieldPath.documentId(), "asc"));
}

export async function clearRoomMessages(roomId) {
  assertRoomId(roomId);
  return deleteMatching(roomId, ref => messageOrder(ref, "asc"));
}

/**
 * Deletes the room document without deleting its messages subcollection.
 * @param {string} roomId
 * @returns {Promise<void>}
 */
export async function deleteRoom(roomId) {
  assertRoomId(roomId);
  await invalidateMessageCache(roomId);

  try {
    await db.runTransaction(async tx => {
      const ref = roomRef(roomId);
      const room = await tx.get(ref);
      if (!room.exists) { return; }
      if (room.data()._messageDeletion) { throw new RoomDeletingError(roomId); }
      tx.delete(ref);
    });
  } finally { await invalidateMessageCache(roomId); }
}

/**
 * Deletes all messages across every room.
 * @returns {Promise<number>}
 */
export async function clearEveryMsg() {
  const snapshot = await rooms.get();
  let total = 0;
  for (const room of snapshot.docs) { total += await clearRoomMessages(room.id); }
  return total;
}
