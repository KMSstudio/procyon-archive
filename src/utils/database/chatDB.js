/* @/utils/database/chatDB.js */

import admin from "firebase-admin";
import { redis } from "@/utils/redis";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();
const roomCollection = db.collection(process.env.FIRE_DB_CHAT_TABLE || "chatRooms");
const RECENT_LIMIT = Number(process.env.CHAT_RECENT_LIMIT || 50);
const CACHE_TTL = Number(process.env.CHAT_CACHE_TTL || 60);

function cleanText(value) {
  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").trim() : value;
}

function nowKST() {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 19);
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

/** Check if room exists */
export async function isRoomExist(roomId) {
  if (!roomId) return false;
  return (await fetchRoom(roomId)) !== null;
}

/** Create or update room */
export async function saveRoom(roomId, data = {}) {
  if (!roomId) return null;
  const now = nowKST();
  const roomData = { roomName: cleanText(data.roomName || roomId), createdAt: data.createdAt || now, updatedAt: now, ...data };

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

/** Fetch recent messages in a room */
export async function fetchMessages(roomId, limit = RECENT_LIMIT) {
  if (!roomId) return [];
  const key = recentKey(roomId);

  try {
    const cached = await redis.lrange(key, 0, limit - 1);
    if (cached.length > 0) return cached.reverse();

    const snapshot = await messageCollection(roomId).orderBy("createdAt", "desc").limit(limit).get();
    const messages = [];
    snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));

    const safeMessages = JSON.parse(JSON.stringify(messages));
    if (safeMessages.length > 0) {
      await redis.del(key);
      await redis.lpush(key, ...safeMessages);
      await redis.expire(key, CACHE_TTL);
      await redis.set(latestKey(roomId), safeMessages[0].createdAt, { ex: CACHE_TTL });
    }

    return safeMessages.reverse();
  } catch (error) {
    console.error(`Error fetching messages from room ${roomId}:`, error);
    throw error;
  }
}

/** Fetch newer messages after createdAt */
export async function fetchNewMessages(roomId, after, limit = 100) {
  if (!roomId) return [];

  try {
    const latest = await redis.get(latestKey(roomId));
    if (after && latest && after >= latest) return [];

    const cached = await redis.lrange(recentKey(roomId), 0, RECENT_LIMIT - 1);
    if (cached.length > 0) {
      const messages = cached.reverse().filter(message => !after || message.createdAt > after);
      if (messages.length > 0) return messages.slice(0, limit);
      if (after && latest) return [];
    }

    let query = messageCollection(roomId).orderBy("createdAt", "asc").limit(limit);
    if (after) query = messageCollection(roomId).where("createdAt", ">", after).orderBy("createdAt", "asc").limit(limit);

    const snapshot = await query.get();
    const messages = [];
    snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));

    const safeMessages = JSON.parse(JSON.stringify(messages));
    if (safeMessages.length > 0) {
      await redis.lpush(recentKey(roomId), ...safeMessages.slice().reverse());
      await redis.ltrim(recentKey(roomId), 0, RECENT_LIMIT - 1);
      await redis.expire(recentKey(roomId), CACHE_TTL);
      await redis.set(latestKey(roomId), safeMessages[safeMessages.length - 1].createdAt, { ex: CACHE_TTL });
    }

    return safeMessages;
  } catch (error) {
    console.error(`Error fetching new messages from room ${roomId}:`, error);
    throw error;
  }
}

/** Send message */
export async function saveMessage(roomId, data) {
  if (!roomId || !data) return null;
  const now = nowKST();
  const messageData = { text: cleanText(data.text), senderEmail: cleanText(data.senderEmail), senderName: cleanText(data.senderName), createdAt: now };

  try {
    const roomRef = roomCollection.doc(roomId);
    const messageRef = messageCollection(roomId).doc();
    const message = { id: messageRef.id, ...messageData };
    const roomPatch = {
      roomName: cleanText(data.roomName || roomId),
      createdAt: data.roomCreatedAt || now,
      updatedAt: now,
      lastMessage: messageData.text,
      lastMessageSenderName: messageData.senderName,
      lastMessageCreatedAt: now,
    };

    await db.runTransaction(async transaction => {
      transaction.set(messageRef, messageData);
      transaction.set(roomRef, roomPatch, { merge: true });
    });

    await redis.lpush(recentKey(roomId), message);
    await redis.ltrim(recentKey(roomId), 0, RECENT_LIMIT - 1);
    await redis.expire(recentKey(roomId), CACHE_TTL);
    await redis.set(latestKey(roomId), now, { ex: CACHE_TTL });
    await redis.set(roomKey(roomId), { id: roomId, ...roomPatch }, { ex: CACHE_TTL });
    await redis.del("chat:rooms");

    return message;
  } catch (error) {
    console.error(`Error saving message to room ${roomId}:`, error);
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
