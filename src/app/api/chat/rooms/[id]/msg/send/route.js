/* app/api/chat/rooms/[id]/msg/send/route.js */

import {
  isValidRoomId,
  saveMessage,
  saveRoom,
} from "@/utils/database/chatDB";
import { getUserv2 } from "@/utils/auth";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 5000;
const MAX_ROOM_NAME_LENGTH = 100;

/**
 * Stores a new message in the specified chat room.
 *
 * Only authenticated users may send messages. The room is created or updated
 * before the message is stored with the authenticated user's identity.
 *
 * Expected JSON body:
 * {
 *   "text": "Message content",
 *   "roomName": "Optional room name"
 * }
 *
 * @param {Request} request - The incoming HTTP request containing message data.
 * @param {Object} context - The Next.js route context.
 * @param {Object} context.params - Dynamic route parameters.
 * @param {string} context.params.id - The ID of the target chat room.
 * @returns {Promise<Response>} A JSON response containing the stored message.
 */
export async function POST(request, { params }) {
  try {
    const roomId = params.id;

    if (!isValidRoomId(roomId)) {
      return Response.json(
        { ok: false, error: "Invalid roomId" },
        { status: 400 }
      );
    }

    const userData = await getUserv2();

    if (!userData.login) {
      return Response.json(
        { ok: false, error: "Login required" },
        { status: 401 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { ok: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const text = typeof body.text === "string"
      ? body.text.trim()
      : "";

    if (!text) {
      return Response.json(
        { ok: false, error: "Message text is required" },
        { status: 400 }
      );
    }

    if (text.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        {
          ok: false,
          error: `Message text must not exceed ${MAX_MESSAGE_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    const requestedRoomName = typeof body.roomName === "string"
      ? body.roomName.trim()
      : "";

    if (requestedRoomName.length > MAX_ROOM_NAME_LENGTH) {
      return Response.json(
        {
          ok: false,
          error: `Room name must not exceed ${MAX_ROOM_NAME_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    const roomName = requestedRoomName || roomId;

    await saveRoom(roomId, { roomName });

    const message = await saveMessage(roomId, {
      text,
      roomName,
      senderEmail: userData.email,
      senderName: userData.fullName,
    });

    return Response.json(
      {
        ok: true,
        data: {
          roomId,
          message,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/chat/rooms/[id]/msg/send error:",
      error
    );

    return Response.json(
      {
        ok: false,
        error: "Failed to send message",
      },
      { status: 500 }
    );
  }
}
