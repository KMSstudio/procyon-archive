/* @/utils/database/chatDB.js */

import { db } from "@/utils/firebase";
import { redis } from "@/utils/redis";

const roomCollection = db.collection(process.env.FIRE_DB_CHAT_TABLE);
const RECENT_LIMIT = Number(process.env.CHAT_RECENT_LIMIT || 50);
const CACHE_TTL = Number(process.env.TTL_CHAT_CACHE || 60);
const MESSAGE_VERSION = "v1";
const MAX_MESSAGE_LIMIT = 100;

export function isValidRoomId(id) {
  return typeof id === "string" && /^[a-zA-Z0-9_-]{1,50}$/.test(id);
}

function cleanText(value) {
  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "") : value;
}

function nowKST() {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 23);
}

function messageCollection(roomId) {
  return roomCollection.doc(roomId).collection("messages");
}

function roomKey(roomId) {
  return `chat:room:${encodeURIComponent(roomId)}`;
}

function recentKey(roomId) {
  return `chat:room:${encodeURIComponent(roomId)}:recent`;
}

function latestKey(roomId) {
  return `chat:room:${encodeURIComponent(roomId)}:latest`;
}

function parseLimit(value, defaultValue = RECENT_LIMIT) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return defaultValue;
  return Math.min(parsed, MAX_MESSAGE_LIMIT);
}

/**
 * Converts stored message data into the current message format.
 *
 * Supports:
 * - v1 nested sender format
 * - legacy flat senderEmail/senderName/senderMajor format
 */
function normalizeMessage(id, data = {}) {
  if (data.version === "v1") {
    return {
      version: "v1",
      id: id || data.id || null,
      text: cleanText(data.text),
      createdAt: data.createdAt || null,
      sender: {
        email: cleanText(data.sender?.email),
        name: cleanText(data.sender?.name),
        major: cleanText(data.sender?.major),
      },
    };
  }

  return {
    version: "v1",
    id: id || data.id || null,
    text: cleanText(data.text),
    createdAt: data.createdAt || null,
    sender: {
      email: cleanText(data.senderEmail),
      name: cleanText(data.senderName),
      major: cleanText(data.senderMajor || data.major),
    },
  };
}

function serializeMessage(message) {
  return {
    version: MESSAGE_VERSION,
    text: cleanText(message.text),
    createdAt: message.createdAt,
    sender: {
      email: cleanText(message.sender?.email),
      name: cleanText(message.sender?.name),
      major: cleanText(message.sender?.major),
    },
  };
}

function serializeFirestoreDocs(snapshot) {
  const messages = [];
  snapshot.forEach(doc => messages.push(normalizeMessage(doc.id, doc.data())));
  return JSON.parse(JSON.stringify(messages));
}

async function cacheRecentMessages(roomId, messages) {
  if (!messages.length) return;

  const newestFirst = messages.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const cachedMessages = newestFirst.slice(0, RECENT_LIMIT);

  await redis.del(recentKey(roomId));
  await redis.lpush(recentKey(roomId), ...cachedMessages);
  await redis.expire(recentKey(roomId), CACHE_TTL);
  await redis.set(latestKey(roomId), cachedMessages[0].createdAt, { ex: CACHE_TTL });
}

/** Fetch room info */
export async function fetchRoom(roomId) {
  if (!roomId) return null;
  const key = roomKey(roomId);

  try {
    const cached = await redis.get(key);
    if (cached) return cached;

    const doc = await roomCollection.doc(roomId).get();
    if (!doc.exists) return null;

    const room = { id: doc.id, ...JSON.parse(JSON.stringify(doc.data())) };
    await redis.set(key, room, { ex: CACHE_TTL });
    return room;
  } catch (error) {
    console.error(`Error fetching chat room ${roomId}:`, error);
    throw error;
  }
}

/** Check whether a room exists */
export async function isRoomExist(roomId) {
  if (!roomId) return false;
  if (!isValidRoomId(roomId)) return false;
  return (await fetchRoom(roomId)) !== null;
}

/** Create or update room */
export async function upsertRoom(roomId, data = {}) {
  if (!roomId) return null;

  const now = nowKST();
  const roomData = {
    roomName: cleanText(data.roomName || roomId),
    createdAt: data.createdAt || now,
    updatedAt: now,
    ...data,
  };

  try {
    await roomCollection.doc(roomId).set(roomData, { merge: true });

    const room = { id: roomId, ...roomData };
    await redis.set(roomKey(roomId), room, { ex: CACHE_TTL });
    await redis.del("chat:rooms");

    return room;
  } catch (error) {
    console.error(`Error saving chat room ${roomId}:`, error);
    throw error;
  }
}

/** Fetch all rooms */
export async function fetchAllRooms() {
  try {
    const cached = await redis.get("chat:rooms");
    if (cached) return cached;

    const snapshot = await roomCollection.orderBy("updatedAt", "desc").get();
    const rooms = [];
    snapshot.forEach(doc => rooms.push({ id: doc.id, ...doc.data() }));

    const safeRooms = JSON.parse(JSON.stringify(rooms));
    await redis.set("chat:rooms", safeRooms, { ex: CACHE_TTL });
    return safeRooms;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }
}

/**
 * Fetch messages relative to timestamp cursors.
 *
 * - before: Fetch messages older than the cursor.
 * - after: Fetch messages newer than the cursor.
 * - neither: Fetch the most recent messages.
 *
 * Messages are always returned from oldest to newest.
 */
export async function fetchMessagesByTime(roomId, options = {}) {
  if (!roomId) return [];

  const before = cleanText(options.before) || null;
  const after = cleanText(options.after) || null;
  const limit = parseLimit(options.limit);

  if (before && after) { throw new Error("before and after cannot be used together"); }

  try {
    if (after) {
      const latest = await redis.get(latestKey(roomId));
      if (latest && after >= latest) return [];

      const cached = await redis.lrange(recentKey(roomId), 0, RECENT_LIMIT - 1);
      if (cached.length) {
        const messages = cached
          .map(message => normalizeMessage(message.id, message))
          .reverse()
          .filter(message => message.createdAt > after)
          .slice(0, limit);

        if (messages.length) return messages;
        if (latest) return [];
      }

      const snapshot = await messageCollection(roomId)
        .where("createdAt", ">", after)
        .orderBy("createdAt", "asc")
        .limit(limit)
        .get();

      const messages = serializeFirestoreDocs(snapshot);
      if (messages.length) await cacheRecentMessages(roomId, messages);
      return messages;
    }

    if (before) {
      const snapshot = await messageCollection(roomId)
        .where("createdAt", "<", before)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      return serializeFirestoreDocs(snapshot).reverse();
    }

    const cached = await redis.lrange(recentKey(roomId), 0, limit - 1);
    if (cached.length >= Math.min(limit, RECENT_LIMIT)) {
      return cached.map(message => normalizeMessage(message.id, message)).reverse();
    }

    const snapshot = await messageCollection(roomId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const messages = serializeFirestoreDocs(snapshot).reverse();
    if (messages.length) await cacheRecentMessages(roomId, messages);
    return messages;
  } catch (error) {
    console.error(`Error fetching messages from room ${roomId}:`, error);
    throw error;
  }
}

/** Fetch recent messages in a room */
export async function fetchMessages(roomId, limit = RECENT_LIMIT) {
  return fetchMessagesByTime(roomId, { limit });
}

/**
 * Save a new v1 message.
 *
 * Expected data:
 * {
 *   text,
 *   sender: {
 *     email,
 *     name,
 *     major
 *   }
 * }
 */
export async function saveMessage(roomId, data) {
  if (!roomId || !data) return null;

  const now = nowKST();
  const messageRef = messageCollection(roomId).doc();

  const message = normalizeMessage(messageRef.id, {
    version: MESSAGE_VERSION,
    text: data.text,
    createdAt: now,
    sender: data.sender,
  });
  const messageData = serializeMessage(message);

  const roomPatch = {
    updatedAt: now,
    lastMessage: message.text,
    lastMessageSenderName: message.sender.name,
    lastMessageCreatedAt: now,
  };

  try {
    const roomRef = roomCollection.doc(roomId);

    await db.runTransaction(async transaction => {
      transaction.set(messageRef, messageData);
      transaction.set(roomRef, roomPatch, { merge: true });
    });

    await redis.lpush(recentKey(roomId), message);
    await redis.ltrim(recentKey(roomId), 0, RECENT_LIMIT - 1);
    await redis.expire(recentKey(roomId), CACHE_TTL);

    await redis.set(
      latestKey(roomId),
      now,
      { ex: CACHE_TTL }
    );

    return message;
  } catch (error) {
    console.error(
      `Error saving message to room ${roomId}:`,
      error
    );

    throw error;
  }
}

/** Delete message */
export async function deleteMessage(roomId, messageId) {
  if (!roomId || !messageId) return;

  try {
    await messageCollection(roomId).doc(messageId).delete();
    await redis.del(recentKey(roomId));
  } catch (error) {
    console.error(`Error deleting message ${messageId} from room ${roomId}:`, error);
    throw error;
  }
}

/** Delete room only */
export async function deleteRoom(roomId) {
  if (!roomId) return;

  try {
    await roomCollection.doc(roomId).delete();
    await redis.del(roomKey(roomId), recentKey(roomId), latestKey(roomId), "chat:rooms");
  } catch (error) {
    console.error(`Error deleting chat room ${roomId}:`, error);
    throw error;
  }
}
