/* app/chat/page.js */

import { getUserv2 } from "@/utils/auth";
import ChatPageClient from "@/app/components/chat/ChatPageClient";

export default async function ChatPage() {
  const userData = await getUserv2();

  return (
    <ChatPageClient
      userData={userData}
      defaultRoomId="general"
    />
  );
}
