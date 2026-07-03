/* app/api/chat/rooms/[id]/msg/route.js */

import { fetchMessages, saveMessage, saveRoom } from "@/utils/database/chatDB";

export const runtime = "nodejs";

function isValidRoomId(roomId) {
  return typeof roomId === "string" && /^[a-zA-Z0-9_-]{1,50}$/.test(roomId);
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!isValidRoomId(id)) return Response.json({ ok: false, error: "Invalid roomId" }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

    const messages = await fetchMessages(id, limit);
    const latest = messages.length ? messages[messages.length - 1].createdAt : null;
    const oldest = messages.length ? messages[0].createdAt : null;

    return Response.json({ ok: true, data: { roomId: id, messages, cursor: { oldest, latest } } });
  } catch (error) {
    console.error("GET /api/chat/rooms/[id]/msg error:", error);
    return Response.json({ ok: false, error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    if (!isValidRoomId(id)) return Response.json({ ok: false, error: "Invalid roomId" }, { status: 400 });

    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) return Response.json({ ok: false, error: "Message text is required" }, { status: 400 });

    await saveRoom(id, { roomName: body.roomName || id });

    const message = await saveMessage(id, {
      text,
      roomName: body.roomName || id,
      senderEmail: body.senderEmail || "anonymous",
      senderName: body.senderName || "Anonymous",
    });

    return Response.json({ ok: true, data: { roomId: id, message } });
  } catch (error) {
    console.error("POST /api/chat/rooms/[id]/msg error:", error);
    return Response.json({ ok: false, error: "Failed to send message" }, { status: 500 });
  }
}
