/* app/api/chat/rooms/route.js */

import { fetchAllRooms, upsertRoom } from "@/utils/database/chatDB";

export const runtime = "nodejs";

function isValidRoomId(roomId) {
  return typeof roomId === "string" && /^[a-zA-Z0-9_-]{1,50}$/.test(roomId);
}

export async function GET() {
  try {
    const rooms = await fetchAllRooms();
    return Response.json({ ok: true, data: { rooms } });
  } catch (error) {
    console.error("GET /api/chat/rooms error:", error);
    return Response.json({ ok: false, error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const roomId = body.roomId?.trim();
    const roomName = body.roomName?.trim() || roomId;

    if (!isValidRoomId(roomId)) return Response.json({ ok: false, error: "Invalid roomId" }, { status: 400 });

    const room = await upsertRoom(roomId, { roomName });
    return Response.json({ ok: true, data: { room } });
  } catch (error) {
    console.error("POST /api/chat/rooms error:", error);
    return Response.json({ ok: false, error: "Failed to create room" }, { status: 500 });
  }
}
