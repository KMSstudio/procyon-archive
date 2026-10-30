/* @/app/api/chat/rooms/[id]/messages/all/route.js */

import { NextResponse } from "next/server";
import { getUserv2 } from "@/utils/getUser";
import { clearRoomMessages, ChatError, RoomNotFoundError } from "@/service/chatService";
import { RoomDeletingError } from "@/repository/chatRepository";

export const runtime = "nodejs";

function failure(error, status) { return NextResponse.json({ ok: false, error }, { status }); }

/**
 * Deletes every message in a room without deleting the room itself.
 * @param {Request} request
 * @param {{params: {id: string}}} context
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request, { params }) {
  try {
    const user = await getUserv2();
    if (!user.login) { return failure("Authentication required", 401); }
    if (!user.admin) { return failure("Administrator permission required", 403); }

    const result = await clearRoomMessages((await params).id);
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    if (error instanceof RoomNotFoundError) { return failure(error.message, 404); }
    if (error instanceof RoomDeletingError) { return failure(error.message, 409); }
    if (error instanceof ChatError || error instanceof TypeError) { return failure(error.message, 400); }
    console.error("Clear chat messages API error:", error);
    return failure("Internal server error", 500);
  }
}
