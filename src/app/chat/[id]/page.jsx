/* app/chat/[id]/page.js */

import ChatRoom from "./ChatRoom";
import { getUserv2 } from "@/utils/auth";
import { anonymizeChat, anonymizeSender } from "@/utils/chat/anonymize";
import { fetchRoom, fetchMessages } from "@/utils/database/chatDB";
import { redirect } from "next/navigation";

export default async function ChatRoomPage({ params }) {
  const { id: roomId } = await params;

  const userData = await getUserv2();
  if (!userData.login) { redirect("/"); }

  const [room, msg] = await Promise.all([
    fetchRoom(roomId),
    fetchMessages(roomId),
  ]);
  const annMsg = msg.map(anonymizeChat);
  const annUser = anonymizeSender({ email: userData.email, name: userData.name, major: userData.major });

  const cursor = {
    oldest: msg.length ? msg[0].createdAt : null,
    latest: msg.length ? msg[msg.length - 1].createdAt : null,
  };

  return (
    <ChatRoom
      annUser={annUser}
      room={room}
      annMsg={annMsg}
      cursor={cursor}
    />
  );
}
