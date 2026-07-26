/* app/chat/[id]/ChatRoom.jsx */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ChatListSection from "./ChatListSection";
import ChatInputSection from "./ChatInputSection";
import "@/styles/chat.css";

const POLLING_INTERVAL = 750;

function mergeMessages(current, incoming) {
  if (!Array.isArray(incoming) || !incoming.length) return current;

  const messageMap = new Map(current.map(message => [message.id, message]));
  incoming.forEach(message => {
    if (message?.id) messageMap.set(message.id, message);
  });

  return [...messageMap.values()].sort((a, b) => {
    const timeCompare = String(a.createdAt).localeCompare(String(b.createdAt));
    return timeCompare || String(a.id).localeCompare(String(b.id));
  });
}

export default function ChatRoom({ userData, room, msg, cursor }) {
  const initialMessages = Array.isArray(msg) ? msg : [];
  const initialLatest = cursor?.latest || initialMessages.at(-1)?.createdAt || null;

  const [messages, setMessages] = useState(initialMessages);
  const [sending, setSending] = useState(false);
  const latestCursorRef = useRef(initialLatest);
  const pollingRef = useRef(false);

  const roomId = room.id;
  const encodedRoomId = encodeURIComponent(roomId);

  const applyMessages = useCallback(incoming => {
    if (!Array.isArray(incoming) || !incoming.length) return;

    setMessages(current => mergeMessages(current, incoming));

    const newest = incoming[incoming.length - 1];
    if (newest?.createdAt && (!latestCursorRef.current || newest.createdAt > latestCursorRef.current)) {
      latestCursorRef.current = newest.createdAt;
    }
  }, []);

  const fetchUpdates = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;

    try {
      const searchParams = new URLSearchParams({ limit: "100" });
      if (latestCursorRef.current) searchParams.set("after", latestCursorRef.current);

      const response = await fetch(
        `/api/chat/rooms/${encodedRoomId}/msg/update?${searchParams}`,
        { method: "GET", cache: "no-store" }
      );

      if (!response.ok) return;

      const result = await response.json();
      if (!result.ok) return;

      applyMessages(result.data.messages);

      const latest = result.data.cursor?.latest;
      if (latest) latestCursorRef.current = latest;
    } catch (error) {
      console.error("Failed to update chat messages:", error);
    } finally {
      pollingRef.current = false;
    }
  }, [applyMessages, encodedRoomId]);

  useEffect(() => {
    let active = true;
    let timeoutId;

    const poll = async () => {
      if (!active) return;
      await fetchUpdates();
      if (active) timeoutId = window.setTimeout(poll, POLLING_INTERVAL);
    };

    timeoutId = window.setTimeout(poll, POLLING_INTERVAL);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [fetchUpdates]);

  const sendMessage = useCallback(async text => {
    if (sending) return false;
    setSending(true);

    try {
      const response = await fetch(`/api/chat/rooms/${encodedRoomId}/msg/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          roomName: room.roomName || room.id,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.ok) {
        console.error(result.error || "Failed to send message");
        return false;
      }

      applyMessages([result.data.message]);
      return true;
    } catch (error) {
      console.error("Failed to send chat message:", error);
      return false;
    } finally {
      setSending(false);
    }
  }, [applyMessages, encodedRoomId, room.id, room.roomName, sending]);

  return (
    <main className="chat-room">
      <ChatListSection
        messages={messages}
        currentUserEmail={userData.email}
      />

      <ChatInputSection
        userData={userData}
        disabled={sending}
        onSend={sendMessage}
      />
    </main>
  );
}
