/* @/app/api/chat/rooms/[id]/messages/[messageId]/route.js */

import { NextResponse } from "next/server";
import { getUserv2 } from "@/utils/getUser";
import { removeMessage, ChatError, RoomNotFoundError, MessageNotFoundError } from "@/service/chatService";
import { RoomDeletingError } from "@/repository/chatRepository";

export const runtime = "nodejs";

function failure(error, status) { return NextResponse.json({ ok: false, error }, { status }); }

/**
 * Deletes an individual message with administrator permission.
 * @param {Request} request
 * @param {{params: {id: string, messageId: string}}} context
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request, { params }) {
  try {
    const user = await getUserv2();
    if (!user.login) { return failure("Authentication required", 401); }
    if (!user.admin) { return failure("Administrator permission required", 403); }

    const result = await removeMessage((await params).id, params.messageId);
    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    if (error instanceof RoomNotFoundError || error instanceof MessageNotFoundError) { return failure(error.message, 404); }
    if (error instanceof RoomDeletingError) { return failure(error.message, 409); }
    if (error instanceof ChatError || error instanceof TypeError) { return failure(error.message, 400); }
    console.error("Delete chat message API error:", error);
    return failure("Internal server error", 500);
  }
}
