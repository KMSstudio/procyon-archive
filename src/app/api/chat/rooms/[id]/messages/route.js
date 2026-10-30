/* @/app/api/chat/rooms/[id]/messages/route.js */

import { NextResponse } from "next/server";
import { getUserv2 } from "@/utils/getUser";
import { anonymizeChat } from "@/utils/chat/anonymize";
import { getMessages, sendMessage, removeMessagesByTime, ChatError, RoomNotFoundError } from "@/service/chatService";
import { RoomDeletingError } from "@/repository/chatRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function success(data, status = 200) { return NextResponse.json({ ok: true, data }, { status }); }
function failure(error, status) { return NextResponse.json({ ok: false, error }, { status }); }

function handleError(error) {
  if (error instanceof RoomNotFoundError) { return failure(error.message, 404); }
  if (error instanceof RoomDeletingError) { return failure(error.message, 409); }
  if (error instanceof ChatError || error instanceof TypeError) { return failure(error.message, 400); }
  console.error("Chat messages API error:", error);
  return failure("Internal server error", 500);
}

/**
 * Retrieves recent, older, or newer messages using composite cursors.
 * @param {Request} request
 * @param {{params: {id: string}}} context
 * @returns {Promise<NextResponse>}
 */
export async function GET(request, { params }) {
  try {
    const id = (await params).id
    const user = await getUserv2();
    if (!user.login) { return failure("Authentication required", 401); }

    const { searchParams } = new URL(request.url);
    const before = searchParams.get("before") ?? undefined;
    const after = searchParams.get("after") ?? undefined;
    const rawLimit = searchParams.get("limit");
    const limit = rawLimit === null ? undefined : Number(rawLimit);

    if (before != null && after != null) { return failure("before and after cannot be combined", 400); }

    const page = await getMessages(id, { before, after, limit });
    const messages = page.messages.map(anonymizeChat);

    return success({
      roomId: id,
      messages,
      direction: before != null ? "before" : after != null ? "after" : "recent",
      cursor: page.cursor,
      hasMessages: messages.length > 0,
      hasMore: page.hasMore,
    });
  } catch (error) { return handleError(error); }
}

/**
 * Sends a message using the authenticated user's identity.
 * @param {Request} request
 * @param {{params: {id: string}}} context
 * @returns {Promise<NextResponse>}
 */
export async function POST(request, { params }) {
  try {
    const user = await getUserv2();
    if (!user.login || !user.email) { return failure("Authentication required", 401); }

    let body;
    try { body = await request.json(); }
    catch { return failure("Invalid JSON body", 400); }

    if (!body || typeof body !== "object" || Array.isArray(body)) { return failure("Invalid request body", 400); }

    const sender = { email: user.email, name: user.name, major: user.major };
    const message = await sendMessage((await params).id, { text: body.text, sender });

    return success(anonymizeChat(message), 201);
  } catch (error) { return handleError(error); }
}

/**
 * Deletes messages within the half-open time interval [from, to).
 * @param {Request} request
 * @param {{params: {id: string}}} context
 * @returns {Promise<NextResponse>}
 */
export async function DELETE(request, { params }) {
  try {
    const user = await getUserv2();
    if (!user.login) { return failure("Authentication required", 401); }
    if (!user.admin) { return failure("Administrator permission required", 403); }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!from || !to) { return failure("Both from and to are required", 400); }
    return success(await removeMessagesByTime((await params).id, { from, to }));
  } catch (error) { return handleError(error); }
}
