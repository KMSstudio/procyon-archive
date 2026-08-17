/* app/chat/[id]/page.jsx */

import ChatRoomMain from "@/app/components/chat/ChatRoomMain";

export default async function Page({ params }) {
  const { id } = await params;
  return <ChatRoomMain roomId={id} />;
}
