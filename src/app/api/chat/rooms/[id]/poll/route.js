/* app/api/chat/rooms/[id]/pool/route.js */

import { fetchNewMessages } from "@/utils/database/chatDB";

export const runtime = "nodejs";

function isValidRoomId(id) {
  return typeof id === "string" && /^[a-zA-Z0-9_-]{1,50}$/.test(id);
}

export async function GET(request, { params }) {
  try {
    const roomId = params.id;
    if (!isValidRoomId(roomId)) return Response.json({ ok: false, error: "Invalid roomId" }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const after = searchParams.get("after");
    const limit = Math.min(Number(searchParams.get("limit") || 100), 100);

    const messages = await fetchNewMessages(roomId, after, limit);
    const latest = messages.length ? messages[messages.length - 1].createdAt : after || null;

    return Response.json({ ok: true, data: { roomId, messages, latest, hasNew: messages.length > 0 } });
  } catch (error) {
    console.error("GET /api/chat/rooms/[id]/pool error:", error);
    return Response.json({ ok: false, error: error.message || "Failed to pool messages" }, { status: 500 });
  }
}
