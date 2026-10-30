/* @/app/components/chat/ChatRoomMain.js */

import ChatRoom from "./ChatRoom";
import { getUserv2 } from "@/utils/getUser";
import { anonymizeChat, anonymizeSender } from "@/utils/chat/anonymize";
import { fetchRoom, fetchMessages } from "@/utils/database/chatDB";

export default async function ChatRoomMain({ roomId, embedded = false }) {
  const userData = await getUserv2();
  if (!userData.login) {
    return <div className="chat-login-required">Login required.</div>; }

  const [room, msg] = await Promise.all([
    fetchRoom(roomId),
    fetchMessages(roomId),
  ]);
  if (!room) {
    return <div className="chat-login-required">Invalid.</div>; }
  const annMsg = msg.map(anonymizeChat);
  const annUser = anonymizeSender({ email: userData.email, name: userData.name, major: userData.major });

  return (
    <ChatRoom
      annUser={annUser}
      room={room}
      annMsg={annMsg}
      embedded={embedded}
    />
  );
}
