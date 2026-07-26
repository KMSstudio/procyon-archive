/* app/api/chat/rooms/[id]/load/route.js */

import {
  isValidRoomId,
  fetchRoom,
  fetchMessages,
} from "@/utils/database/chatDB";
import { getUserv2 } from "@/utils/auth";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function parseLimit(value) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
}

/**
 * Loads the selected chat room and its recent messages.
 *
 * The response contains only the room matching the provided room ID,
 * along with its recent messages and cursor timestamps.
 *
 * Query parameters:
 * - limit: Maximum number of messages to retrieve.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} context - The Next.js route context.
 * @param {Object} context.params - Dynamic route parameters.
 * @param {string} context.params.id - The selected chat room ID.
 * @returns {Promise<Response>} A JSON response containing the selected room,
 * its recent messages, and message cursor timestamps.
 */
export async function GET(request, { params }) {
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

    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get("limit"));

    const [room, messages] = await Promise.all([
      fetchRoom(roomId),
      fetchMessages(roomId, limit),
    ]);

    if (!room) {
      return Response.json(
        { ok: false, error: "Room not found" },
        { status: 404 }
      );
    }

    const oldest = messages.length
      ? messages[0].createdAt
      : null;

    const latest = messages.length
      ? messages[messages.length - 1].createdAt
      : null;

    return Response.json({
      ok: true,
      data: {
        room,
        messages,
        cursor: {
          oldest,
          latest,
        },
      },
    });
  } catch (error) {
    console.error(
      "GET /api/chat/rooms/[id]/load error:",
      error
    );

    return Response.json(
      { ok: false, error: "Failed to load chat room" },
      { status: 500 }
    );
  }
}
