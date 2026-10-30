/* @/service/chatService.js */

import "server-only";

import {
  fetchRoom,
  fetchAllRooms,
  upsertRoom as repoUpsertRoom,
  saveMessage,
  fetchMessagesByCursor,
  deleteMessage,
  deleteMessagesByTime,
  clearRoomMessages as repoClearRoomMessages,
} from "@/repository/chatRepository";

/**
 * @typedef {import("@/utils/chat/types").Chat} Chat
 * @typedef {import("@/utils/chat/types").ChatRoom} ChatRoom
 * @typedef {import("@/utils/chat/types").MessageQuery} MessageQuery
 * @typedef {import("@/utils/chat/types").MessagePage} MessagePage
 * @typedef {import("@/utils/chat/types").TimeRange} TimeRange
 * @typedef {import("@/utils/chat/types").DeleteResult} DeleteResult
 */

/* ===== Domain Errors ===== */

export class ChatError extends Error { constructor(message, code = "CHAT_ERROR") { super(message); this.name = this.constructor.name; this.code = code; } }
export class RoomNotFoundError extends ChatError { constructor(roomId) { super(`Chat room '${roomId}' not found`, "ROOM_NOT_FOUND"); } }
export class MessageNotFoundError extends ChatError { constructor(messageId) { super(`Message '${messageId}' not found`, "MESSAGE_NOT_FOUND"); } }
export class InvalidRoomError extends ChatError { constructor(message = "Invalid chat room") { super(message, "INVALID_ROOM"); } }
export class InvalidMessageError extends ChatError { constructor(message = "Invalid message") { super(message, "INVALID_MESSAGE"); } }

/* ===== Validation ===== */

/**
 * Validates message text and sender information.
 * @param {Pick<Chat, "text" | "sender">} data
 * @returns {Pick<Chat, "text" | "sender">}
 */
function validateMessage(data) {
  const { text, sender } = data || {};
  if (typeof text !== "string" || !text.trim() || text.length > 5000) { throw new InvalidMessageError("Message text must contain 1–5000 characters"); }
  if (!sender || typeof sender !== "object" || Array.isArray(sender)) { throw new InvalidMessageError("Invalid sender"); }

  const { email, name, major } = sender;
  if (typeof email !== "string" || !email.trim()) { throw new InvalidMessageError("Sender email is required"); }
  if (typeof name !== "string" || typeof major !== "string") { throw new InvalidMessageError("Invalid sender information"); }

  return { text, sender: { email, name, major } };
}

async function requireRoom(roomId) {
  const room = await fetchRoom(roomId);
  if (!room) { throw new RoomNotFoundError(roomId); }
  return room;
}

function rethrowRoomError(error, roomId) {
  if (error instanceof Error && error.message === "Room not found") { throw new RoomNotFoundError(roomId); }
  throw error;
}

/* ===== Room Service ===== */

/** @returns {Promise<ChatRoom[]>} */
export async function getAllRooms() { return fetchAllRooms(); }

/**
 * @param {string} roomId
 * @returns {Promise<ChatRoom|null>}
 */
export async function getRoom(roomId) { return fetchRoom(roomId); }

/**
 * Creates or updates a chat room.
 * @param {string} roomId
 * @param {Partial<Omit<ChatRoom, "id" | "_messageDeletion">>} data
 * @returns {Promise<ChatRoom>}
 */
export async function upsertRoom(roomId, data = {}) {
  if (!data || typeof data !== "object" || Array.isArray(data)) { throw new InvalidRoomError("Invalid room data"); }
  if (data.roomName != null && (typeof data.roomName !== "string" || !data.roomName.trim())) { throw new InvalidRoomError("Invalid room name"); }
  return repoUpsertRoom(roomId, data);
}

/* ===== Message Service ===== */

/**
 * Saves a message using a sender provided by a trusted server entry point.
 * @param {string} roomId
 * @param {Pick<Chat, "text" | "sender">} data
 * @returns {Promise<Chat>}
 */
export async function sendMessage(roomId, data) {
  const message = validateMessage(data);
  try { return await saveMessage(roomId, message); }
  catch (error) { rethrowRoomError(error, roomId); }
}

/**
 * Retrieves messages with composite cursor pagination.
 * @param {string} roomId
 * @param {MessageQuery} options
 * @returns {Promise<MessagePage>}
 */
export async function getMessages(roomId, options = {}) {
  await requireRoom(roomId);
  return fetchMessagesByCursor(roomId, options);
}

/* ===== Message Deletion Service ===== */

/**
 * Deletes a message and throws when the target does not exist.
 * @param {string} roomId
 * @param {string} messageId
 * @returns {Promise<DeleteResult>}
 */
export async function removeMessage(roomId, messageId) {
  try {
    const result = await deleteMessage(roomId, messageId);
    if (!result.deletedCount) { throw new MessageNotFoundError(messageId); }
    return result;
  } catch (error) { rethrowRoomError(error, roomId); }
}

/**
 * Deletes messages within the half-open time range [from, to).
 * @param {string} roomId
 * @param {TimeRange} range
 * @returns {Promise<DeleteResult>}
 */
export async function removeMessagesByTime(roomId, range) {
  try {
    const deletedCount = await deleteMessagesByTime(roomId, range);
    return { deletedCount };
  } catch (error) { rethrowRoomError(error, roomId); }
}

/**
 * Deletes all messages while preserving the chat room.
 * @param {string} roomId
 * @returns {Promise<DeleteResult>}
 */
export async function clearRoomMessages(roomId) {
  try {
    const deletedCount = await repoClearRoomMessages(roomId);
    return { deletedCount };
  } catch (error) { rethrowRoomError(error, roomId); }
}
