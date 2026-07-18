/* app/api/chat/rooms/[id]/msg/route.js */

import { fetchMessages, saveMessage, saveRoom } from "@/utils/database/chatDB";
import { getUserv2 } from "@/utils/auth";

export const runtime = "nodejs";

function isValidRoomId(id) {
  return typeof id === "string" && /^[a-zA-Z0-9_-]{1,50}$/.test(id);
}

export async function GET(request, { params }) {
  try {
    const roomId = params.id;
    if (!isValidRoomId(roomId)) return Response.json({ ok: false, error: "Invalid roomId" }, { status: 400 });

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") || 50), 100);

    const messages = await fetchMessages(roomId, limit);
    const latest = messages.length ? messages[messages.length - 1].createdAt : null;
    const oldest = messages.length ? messages[0].createdAt : null;

    return Response.json({ ok: true, data: { roomId, messages, cursor: { oldest, latest } } });
  } catch (error) {
    console.error("GET /api/chat/rooms/[id]/msg error:", error);
    return Response.json({ ok: false, error: error.message || "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const roomId = params.id;
    if (!isValidRoomId(roomId)) return Response.json({ ok: false, error: "Invalid roomId" }, { status: 400 });

    const userData = await getUserv2();
    if (!userData.login) return Response.json({ ok: false, error: "Login required" }, { status: 401 });

    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) return Response.json({ ok: false, error: "Message text is required" }, { status: 400 });

    await saveRoom(roomId, { roomName: body.roomName || roomId });

    const message = await saveMessage(roomId, {
      text,
      roomName: body.roomName || roomId,
      senderEmail: userData.email,
      senderName: userData.fullName,
    });

    return Response.json({ ok: true, data: { roomId, message } });
  } catch (error) {
    console.error("POST /api/chat/rooms/[id]/msg error:", error);
    return Response.json({ ok: false, error: error.message || "Failed to send message" }, { status: 500 });
  }
}
