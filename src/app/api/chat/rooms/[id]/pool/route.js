/* app/api/chat/rooms/[roomId]/poll/route.js */

import { fetchNewMessages } from "@/utils/database/chatDB";

export const runtime = "nodejs";

function isValidRoomId(roomId) {
  return typeof roomId === "string" && /^[a-zA-Z0-9_-]{1,50}$/.test(roomId);
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!isValidRoomId(id)) return Response.json({ ok: false, error: "Invalid roomId" }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const after = searchParams.get("after");
    const limit = Math.min(Number(searchParams.get("limit") || 100), 100);

    const messages = await fetchNewMessages(id, after, limit);
    const latest = messages.length ? messages[messages.length - 1].createdAt : after || null;

    return Response.json({
      ok: true,
      data: {
        roomId: id,
        messages,
        latest,
        hasNew: messages.length > 0,
      },
    });
  } catch (error) {
    console.error("GET /api/chat/rooms/[roomId]/poll error:", error);
    return Response.json({ ok: false, error: "Failed to poll messages" }, { status: 500 });
  }
}
