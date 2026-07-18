/* app/chat/page.js */

import { redirect } from "next/navigation";
import { getUserv2 } from "@/utils/auth";
import ChatPage from "@/app/components/chat/ChatPage";

export default async function ChatPage() {
  const userData = await getUserv2();

  if (!userData.login) redirect("/");

  return <ChatPage userData={userData} defaultRoomId="general" />;
}
