/* @/app/api/chat/rooms/route.js */

import { NextResponse } from "next/server";
import { getUserv2 } from "@/utils/getUser";
import { getAllRooms, upsertRoom, ChatError } from "@/service/chatService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function success(data, status = 200) { return NextResponse.json({ ok: true, data }, { status }); }
function failure(error, status) { return NextResponse.json({ ok: false, error }, { status }); }
function handleError(error) {
  if (error instanceof ChatError || error instanceof TypeError) { return failure(error.message, 400); }
  console.error("Chat rooms API error:", error);
  return failure("Internal server error", 500);
}

/**
 * Retrieves all chat rooms for authenticated users.
 * @returns {Promise<NextResponse>}
 */
export async function GET() {
  try {
    const user = await getUserv2();
    if (!user.login) { return failure("Authentication required", 401); }
    return success(await getAllRooms());
  } catch (error) { return handleError(error); }
}

/**
 * Creates or updates a chat room with administrator permission.
 */
export async function POST(request) {
  try {
    const user = await getUserv2();
    if (!user.login) { return failure("Authentication required", 401); }
    if (!user.admin) { return failure("Administrator permission required", 403); }

    let body;
    try { body = await request.json(); }
    catch { return failure("Invalid JSON body", 400); }

    if (!body || typeof body !== "object" || Array.isArray(body)) { return failure("Invalid request body", 400); }
    const { roomId, ...data } = body;
    if (typeof roomId !== "string") { return failure("roomId is required", 400); }

    return success(await upsertRoom(roomId, data));
  } catch (error) { return handleError(error); }
}
