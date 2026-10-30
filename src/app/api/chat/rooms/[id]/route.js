/* @/app/api/chat/rooms/[id]/route.js */

import { NextResponse } from "next/server";
import { getUserv2 } from "@/utils/getUser";
import { getRoom, ChatError } from "@/service/chatService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error, status) { return NextResponse.json({ ok: false, error }, { status }); }

/**
 * Retrieves a chat room by its ID.
 */
export async function GET(request, { params }) {
  try {
    const user = await getUserv2();
    if (!user.login) { return failure("Authentication required", 401); }

    const room = await getRoom((await params).id);
    if (!room) { return failure("Chat room not found", 404); }
    return NextResponse.json({ ok: true, data: room });
  } catch (error) {
    if (error instanceof ChatError || error instanceof TypeError) { return failure(error.message, 400); }
    console.error("Chat room API error:", error);
    return failure("Internal server error", 500);
  }
}
