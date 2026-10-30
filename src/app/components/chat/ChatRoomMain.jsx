
/* @/app/components/chat/ChatRoomMain.js */

import ChatRoom from "./ChatRoom";
import { getUserv2 } from "@/utils/getUser";
import { anonymizeChat, anonymizeSender } from "@/utils/chat/anonymize";
import { getRoom, getMessages } from "@/service/chatService";

export default async function ChatRoomMain({ roomId, embedded = false }) {
  const userData = await getUserv2();
  if (!userData.login) { return <div className="chat-login-required">Login required.</div>; }

  const room = await getRoom(roomId);
  if (!room) { return <div className="chat-login-required">Invalid.</div>; }

  const page = await getMessages(roomId, { limit: 50 });
  const annMsg = page.messages.map(anonymizeChat);
  const annUser = anonymizeSender({ email: userData.email, name: userData.name, major: userData.major });

  return (
    <ChatRoom
      annUser={annUser}
      room={room}
      annMsg={annMsg}
      initialCursors={page.cursor}
      embedded={embedded}
    />
  );
}
