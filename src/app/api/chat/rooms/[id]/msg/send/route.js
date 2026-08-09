/* app/api/chat/rooms/[id]/msg/send/route.js */

import {
  isValidRoomId,
  isRoomExist,
  saveMessage,
} from "@/utils/database/chatDB";

import { getUserv2 } from "@/utils/auth";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request, { params }) {
  try {
    const roomId = (await params).id;
    if (!isValidRoomId(roomId)) {
      return Response.json({ ok: false, error: "Invalid roomId" }, { status: 400 }); }
    if (!(await isRoomExist(roomId))) {
      return Response.json({ ok: false, error: "Room not found" }, { status: 404 }); }
    const userData = await getUserv2();
    if (!userData.login) {
      return Response.json({ ok: false, error: "Login required" }, { status: 401 }); }
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) {
      return Response.json({ ok: false, error: "Text not found" }, { status: 400 }); }
    if (text.length > MAX_MESSAGE_LENGTH) {
      return Response.json({ ok: false, error: "Mssag too long" }, { status: 400 }); }

    const message = await saveMessage(roomId, {
      text, sender: { email: userData.email, name: userData.name, major: userData.major } });

    return Response.json(
      { ok: true, data: { roomId, message } }, { status: 201 } );
  } catch (error) {
    console.error("POST /api/chat/rooms/[id]/msg/send error:", error);
    return Response.json( { ok: false, error: "Failed to send message", }, { status: 500 });
  }
}
