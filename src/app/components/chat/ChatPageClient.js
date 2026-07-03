/* components/chat/ChatPageClient.js */

"use client";

import { useState } from "react";
import ChatRoom from "@/app/components/chat/ChatRoom";

export default function ChatPageClient({ userData, defaultRoomId = "general" }) {
  const [roomInput, setRoomInput] = useState(defaultRoomId);
  const [roomId, setRoomId] = useState(defaultRoomId);

  function enterRoom(event) {
    event.preventDefault();
    const nextRoomId = roomInput.trim();

    if (!/^[a-zA-Z0-9_-]{1,50}$/.test(nextRoomId)) {
      alert("roomId는 영문, 숫자, _, - 만 사용할 수 있습니다.");
      return;
    }

    setRoomId(nextRoomId);
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Test Chat</h1>

      <form onSubmit={enterRoom} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={roomInput}
          onChange={event => setRoomInput(event.target.value)}
          placeholder="roomId"
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button type="submit" style={{ padding: "0 16px", border: "1px solid #ddd", borderRadius: 8 }}>
          입장
        </button>
      </form>

      <ChatRoom roomId={roomId} roomName={roomId} userData={userData} />
    </main>
  );
}
