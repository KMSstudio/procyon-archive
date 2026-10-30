/* app/chat/[id]/layout.jsx */

import { isRoomExist } from "@/repository/chatRepository";
import { notFound } from "next/navigation";

export default async function ChatRoomLayout({ children, params }) {
  const { id: roomId } = await params;
  if (!(await isRoomExist(roomId))) { notFound(); }
  return children;
}
