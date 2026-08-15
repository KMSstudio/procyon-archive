/* app/chat/[id]/page.js */

import ChatRoom from "./ChatRoom";
import { getUserv2 } from "@/utils/auth";
import { anonymizeChat, hashSender } from "@/utils/chat/anonymize";
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
  const userHash = hashSender({ email: userData.email, name: userData.name, major: userData.major });

  const cursor = {
    oldest: msg.length ? msg[0].createdAt : null,
    latest: msg.length ? msg[msg.length - 1].createdAt : null,
  };

  return (
    <ChatRoom
      userData={userData}
      userHast={userHash}
      room={room}
      annMsg={annMsg}
      cursor={cursor}
    />
  );
}
