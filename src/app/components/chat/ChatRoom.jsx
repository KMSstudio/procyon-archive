/* @/app/components/chat/ChatRoom.jsx */

"use client";

// React
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// Component
import ChatListSection from "./ChatListSection";
import ChatInputSection from "./ChatInputSection";
// Styles
import "@/styles/chat.css";

/**
 * @typedef {import("@/utils/chat/types").AnnChat} AnnChat
 * @typedef {import("@/utils/chat/types").AnnSender} AnnSender
 */

const CHAT_POLLING = {
  activeIntervalMs: 500,
  idleIntervalMs: 10_000,
  idleAfterMs: 30_000,
};
const CHAT_HISTORY_LIMIT = 50;

/**
 * メッセージを既存の一覧に統合し、
 * IDによる重複除去と時系列順の整列を行います。
 *
 * @param {AnnChat[]} current
 * @param {AnnChat[]} incoming
 * @returns {AnnChat[]}
 */
function mergeMsg(current, incoming) {
  if (!Array.isArray(incoming) || incoming.length === 0) return current;
  const msgMap = new Map(current.map(message => [message.id, message]));
  incoming.forEach(msg => { if (msg?.id) msgMap.set(msg.id, msg); });

  return [...msgMap.values()].sort((a, b) => {
    const cmp = String(a.createdAt).localeCompare(String(b.createdAt));
    return cmp || String(a.id).localeCompare(String(b.id));
  });
}

/**
 * @param {{
 *   annUser: AnnSender,
 *   room: Object,
 *   annMsg: AnnChat[],
 *   embedded: boolean
 * }} props
 */
export default function ChatRoom({ annUser, room, annMsg, embedded }) {
  const router = useRouter();

  const im = Array.isArray(annMsg) ? annMsg : [];
  const [msgs, setMsgs] = useState(im);
  const [isSending, setIsSending] = useState(false);

  const msgCursorsRef = useRef({
    latest: im.at(-1)?.createdAt || null,
    oldest: im.at(0)?.createdAt || null,
  });
  const isFetching = useRef(false);
  const lastActivityAtRef = useRef(Date.now());
  const scheduleNextPollRef = useRef(null);
  const isFetchingHistoryRef = useRef(false);
  const hasMoreHistoryRef = useRef(true);
  const roomId = encodeURIComponent(room.id);

  /**
   * @param {AnnChat[]} incoming
   */
  const applyMessages = useCallback((incoming) => {
    if (!Array.isArray(incoming) || incoming.length === 0) return;
    setMsgs(current => mergeMsg(current, incoming));
    const oldest = incoming.at(0);
    const newest = incoming.at(-1);
    if (
      newest?.createdAt &&
      (!msgCursorsRef.current.latest || newest.createdAt > msgCursorsRef.current.latest)
    ) { msgCursorsRef.current.latest = newest.createdAt; }
    if (
      oldest?.createdAt &&
      (!msgCursorsRef.current.oldest || oldest.createdAt < msgCursorsRef.current.oldest)
    ) {msgCursorsRef.current.oldest = oldest.createdAt;}
  }, []);

  /**
   * Fetches messages created after the latest cursor from the server.
   * Prevents overlapping requests and applies newly received messages.
   */
  const fetchUpdates = useCallback(async (signal) => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const searchParams = new URLSearchParams({limit: "100",});
      if (msgCursorsRef.current.latest) { searchParams.set("after", msgCursorsRef.current.latest); }
      const response = await fetch(
        `/api/chat/rooms/${roomId}/msg/update?${searchParams}`,
        { method: "GET", cache: "no-store", signal }
      ); if (!response.ok) return false;
      const result = await response.json();
      if (!result.ok) return false;
      if (signal.aborted) return;
      applyMessages(result.data.messages);
      if (result.data.messages.length) lastActivityAtRef.current = Date.now();
      return true;
    } catch (error) {
      if (error.name !== "AbortError") console.error("Failed to update chat messages:", error);
      return false;
    }
    finally { isFetching.current = false; }
  }, [applyMessages, roomId]);

  /**
   * 最古メッセージ以前の履歴を取得します。
   *
   * @returns {Promise<boolean>}
   */
  const onTop = useCallback(async () => {
    if (embedded) return false;
    if (isFetchingHistoryRef.current || !hasMoreHistoryRef.current || !msgCursorsRef.current.oldest) return false;
    isFetchingHistoryRef.current = true;

    try {
      const searchParams = new URLSearchParams({
        before: msgCursorsRef.current.oldest,
        limit: String(CHAT_HISTORY_LIMIT),
      });
      const response = await fetch(`/api/chat/rooms/${roomId}/msg/update?${searchParams}`, {
        method: "GET", cache: "no-store",
      });
      if (!response.ok) return false;

      const result = await response.json();
      if (!result.ok) return false;

      const older = result.data.messages;
      if (!Array.isArray(older) || older.length === 0) {
        hasMoreHistoryRef.current = false;
        return false;
      }

      applyMessages(older);
      if (!result.data.hasMore) hasMoreHistoryRef.current = false;
      return true;
    } catch (error) {
      console.error("Failed to load older chat messages:", error);
      return false;
    } finally { isFetchingHistoryRef.current = false; }
  }, [applyMessages, roomId]);

  useEffect(() => {
    let isPollingEnabled = true;
    let pollTimeoutId;
    let isRequestPending = false;
    let lastPollStartedAt = 0;
    let retryDelayMs = 0;
    const abortController = new AbortController();
    const getPollingInterval = () => {
      const inactiveDurationMs = Date.now() - lastActivityAtRef.current;
      const intervalMs = inactiveDurationMs < CHAT_POLLING.idleAfterMs
        ? CHAT_POLLING.activeIntervalMs : CHAT_POLLING.idleIntervalMs;
      return Math.max(intervalMs, retryDelayMs);
    };
    const schedulePoll = (delayMs) => {
      window.clearTimeout(pollTimeoutId);
      if (isPollingEnabled && !document.hidden) {
        pollTimeoutId = window.setTimeout(poll, delayMs);
      }
    };
    const poll = async () => {
      if (!isPollingEnabled || document.hidden || isRequestPending) return;
      isRequestPending = true;
      lastPollStartedAt = Date.now();
      const succeeded = await fetchUpdates(abortController.signal);
      retryDelayMs = succeeded === false
        ? Math.min(CHAT_POLLING.idleIntervalMs,
          (retryDelayMs || CHAT_POLLING.activeIntervalMs) * 2)
        : 0;
      isRequestPending = false;
      // Maintain a 500 ms start-to-start cadence without overlapping requests.
      const requestDurationMs = Date.now() - lastPollStartedAt;
      schedulePoll(Math.max(0, getPollingInterval() - requestDurationMs));
    };
    const resumePolling = () => {
      if (isRequestPending || document.hidden) return;
      const elapsedSinceLastPollMs = Date.now() - lastPollStartedAt;
      schedulePoll(Math.max(0,
        Math.max(CHAT_POLLING.activeIntervalMs, retryDelayMs) - elapsedSinceLastPollMs));
    };
    const handleVisibility = () => {
      window.clearTimeout(pollTimeoutId);
      if (!document.hidden) {
        lastActivityAtRef.current = Date.now();
        resumePolling();
      }
    };
    scheduleNextPollRef.current = resumePolling;
    document.addEventListener("visibilitychange", handleVisibility);
    schedulePoll(0);
    return () => {
      isPollingEnabled = false;
      window.clearTimeout(pollTimeoutId);
      abortController.abort();
      scheduleNextPollRef.current = null;
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchUpdates]);

  const sendMessage = useCallback(
    async (text) => {
      if (isSending) return false;
      setIsSending(true);
      try {
        const headers = {"Content-Type": "application/json",};
        const body = JSON.stringify({ text });
        const options = {method: "POST", headers, body,};
        const response = await fetch(`/api/chat/rooms/${roomId}/msg/send`, options);
        const result = await response.json();
        if (!response.ok || !result.ok) { 
          console.error(result.error || "Failed to send message"); return false; }
        applyMessages([result.data.message]);
        lastActivityAtRef.current = Date.now();
        scheduleNextPollRef.current?.();
        return true;
      } catch (error) { console.error("Failed to send chat message:", error); return false; }
      finally { setIsSending(false); }
    },
    [
      applyMessages,
      roomId,
      isSending,
    ]
  );

  const handleClick = useCallback(() => {
    if (embedded) { router.push(`/chat/${roomId}`); }
  }, [embedded, roomId, router]);

  return (
    <section
      className={`chat-room ${embedded ? "chat-room--embedded" : ""}`}
      onClickCapture={handleClick}
    >
      <ChatListSection messages={msgs} userHash={annUser.hash} onTop={onTop} />
      <ChatInputSection sender={annUser} sending={isSending} onSend={sendMessage} />
    </section>
  );
}
