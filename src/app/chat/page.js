/* app/chat/page.js */

import { redirect } from "next/navigation";
import { getUserv2 } from "@/utils/auth";
import ChatPageClient from "@/app/components/chat/ChatPageClient";

export default async function ChatPage() {
  const userData = await getUserv2();

  if (!userData.login) redirect("/");

  return <ChatPageClient userData={userData} defaultRoomId="general" />;
}
