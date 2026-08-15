/* app/chat/[id]/ChatRoom.jsx */

"use client";

// React
import { useCallback, useEffect, useRef, useState } from "react";
// Component
import ChatListSection from "./ChatListSection";
import ChatInputSection from "./ChatInputSection";
// Styles
import "@/styles/chat.css";

/**
 * @typedef {import("@/utils/chat/types").ChatMessage} ChatMessage
 * @typedef {import("@/utils/chat/types").AnnSender} AnnSender
 */

const CHAT_POLL_INTERVAL = 500;

/**
 * メッセージを既存の一覧に統合し、
 * IDによる重複除去と時系列順の整列を行います。
 *
 * @param {AnnChatMsg[]} current
 * @param {AnnChatMsg[]} incoming
 * @returns {AnnChatMsg[]}
 */
function mergeMsg(current, incoming) {
  if (!Array.isArray(incoming) || incoming.length === 0) { return current; }
  const msgMap = new Map(current.map((message) => [message.id, message]));
  incoming.forEach((msg) => { if (msg?.id) {msgMap.set(msg.id, msg);} });

  return [...msgMap.values()].sort((a, b) => {
    const cmp = String(a.createdAt).localeCompare(String(b.createdAt));
    return cmp || String(a.id).localeCompare(String(b.id));
  });
}

/**
 * @param {{
 *   annUser: AnnSender
 *   room: Object,
 *   msg: ChatMessage[],
 *   cursor: {latest?: string, oldest?: string}
 * }} props
 */
export default function ChatRoom({ annUser, room, annMsg, cursor }) {
  const im = Array.isArray(annMsg) ? annMsg : [];
  const [messages, setMessages] = useState(im);
  const [sending, setSending] = useState(false);

  const cursorRef = useRef({
    latest: cursor?.latest || im.at(-1)?.createdAt || null,
    oldest: cursor?.oldest || im.at(0)?.createdAt || null,
  });
  const pollingRef = useRef(false);
  const roomId = encodeURIComponent(room.id);

  /**
   * Applies incoming messages to the local message state.
   * Updates the latest and oldest cursors based on the received messages.
   */
  const applyMessages = useCallback((incoming) => {
    if (!Array.isArray(incoming) || incoming.length === 0) {
      return;
    }
    setMessages((current) => mergeMsg(current, incoming));

    const oldest = incoming.at(0);
    const newest = incoming.at(-1);
    if (
      newest?.createdAt &&
      (!cursorRef.current.latest || newest.createdAt > cursorRef.current.latest)
    ) { cursorRef.current.latest = newest.createdAt; }
    if (
      oldest?.createdAt &&
      (!cursorRef.current.oldest || oldest.createdAt < cursorRef.current.oldest)
    ) {cursorRef.current.oldest = oldest.createdAt;}
  }, []);

  /**
   * Fetches messages created after the latest cursor from the server.
   * Prevents overlapping requests and applies newly received messages.
   */
  const fetchUpdates = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    try {
      const searchParams = new URLSearchParams({limit: "100",});
      if (cursorRef.current.latest) { searchParams.set("after", cursorRef.current.latest); }
      const response = await fetch(
        `/api/chat/rooms/${roomId}/msg/update?${searchParams}`,
        { method: "GET", cache: "no-store", }
      ); if (!response.ok) return;
      const result = await response.json();
      if (!result.ok) return;
      applyMessages(result.data.messages);
    } catch (error) { console.error("Failed to update chat messages:", error); }
    finally { pollingRef.current = false; }
  }, [applyMessages, roomId]);

  useEffect(() => {
    let active = true;
    let tid;  // Timeout ID
    const poll = async () => {
      if (!active) return;
      await fetchUpdates();
      if (active) { tid = window.setTimeout(poll, CHAT_POLL_INTERVAL); }
    };
    tid = window.setTimeout(poll, CHAT_POLL_INTERVAL);
    return () => {active = false; window.clearTimeout(tid); };
  }, [fetchUpdates]);

  const sendMessage = useCallback(
    async (text) => {
      if (sending) return false;
      setSending(true);
      try {
        const headers = {"Content-Type": "application/json",};
        const body = JSON.stringify({ text });
        const options = {method: "POST", headers, body,};
        const response = await fetch( `/api/chat/rooms/${roomId}/msg/send`, options);
        const result = await response.json();
        if (!response.ok || !result.ok) { 
          console.error(result.error || "Failed to send message"); return false; }
        applyMessages([result.data.message]);
        return true;
      } catch (error) { console.error("Failed to send chat message:", error); return false; }
      finally { setSending(false); }
    },
    [
      applyMessages,
      roomId,
      sending,
    ]
  );

  return (
    <main className="chat-room">
      <ChatListSection
        messages={messages}
        userHash={annUser.hash}
      />

      <ChatInputSection
        sender={annUser}
        disabled={sending}
        onSend={sendMessage}
      />
    </main>
  );
}
