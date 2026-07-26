/* app/chat/[id]/layout.jsx */

import { fetchRoom, isValidRoomId } from "@/utils/database/chatDB";
import { notFound } from "next/navigation";

export default async function ChatRoomLayout({ children, params }) {
  const { id: roomId } = await params;

  if (!isValidRoomId(roomId)) { notFound(); }

  const room = await fetchRoom(roomId);
  if (!room) { notFound(); }

  return children;
}
