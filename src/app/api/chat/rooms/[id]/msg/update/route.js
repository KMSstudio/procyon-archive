/* app/api/chat/rooms/[id]/msg/update/route.js */

import { isValidRoomId, fetchMessagesByTime } from "@/utils/database/chatDB";
import { getUserv2 } from "@/utils/auth";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const CURSOR_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

function parseLimit(value) {
  if (value === null) return DEFAULT_LIMIT;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return DEFAULT_LIMIT;

  return Math.min(parsed, MAX_LIMIT);
}

function isValidCursor(value) {
  return value === null || CURSOR_PATTERN.test(value);
}

/**
 * Retrieves chat messages relative to a timestamp cursor.
 *
 * Query parameters:
 * - before: Returns messages created before this timestamp.
 * - after: Returns messages created after this timestamp.
 * - limit: Maximum number of messages to return. Defaults to 50, max 100.
 *
 * `before` and `after` cannot be used together. Timestamps must use the
 * `YYYY-MM-DD HH:mm:ss` format.
 *
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} context - The Next.js route context.
 * @param {Object} context.params - Dynamic route parameters.
 * @param {string} context.params.id - The chat room ID.
 * @returns {Promise<Response>} The requested messages and updated cursors.
 */
export async function GET(request, { params }) {
  try {
    const roomId = (await params).id;
    if (!isValidRoomId(roomId)) {
      return Response.json({ ok: false, error: "Invalid roomId" }, { status: 400 });
    }

    const userData = await getUserv2();
    if (!userData.login) {
      return Response.json({ ok: false, error: "Login required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const before = searchParams.get("before");
    const after = searchParams.get("after");
    const limit = parseLimit(searchParams.get("limit"));

    if (before && after) {
      return Response.json(
        { ok: false, error: "before and after cannot be used together" },
        { status: 400 }
      );
    }

    if (!isValidCursor(before) || !isValidCursor(after)) {
      return Response.json(
        { ok: false, error: "Cursor must use YYYY-MM-DD HH:mm:ss format" },
        { status: 400 }
      );
    }

    const messages = await fetchMessagesByTime(roomId, { before, after, limit });
    const oldest = messages.length ? messages[0].createdAt : before || after || null;
    const latest = messages.length ? messages[messages.length - 1].createdAt : after || before || null;
    const direction = before ? "before" : after ? "after" : "recent";

    return Response.json({
      ok: true,
      data: {
        roomId,
        messages,
        direction,
        cursor: { oldest, latest },
        hasMessages: messages.length > 0,
        hasMore: messages.length === limit,
      },
    });
  } catch (error) {
    console.error("GET /api/chat/rooms/[id]/msg/update error:", error);
    return Response.json({ ok: false, error: "Failed to fetch message updates" }, { status: 500 });
  }
}
