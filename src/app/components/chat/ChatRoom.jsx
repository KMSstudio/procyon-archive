/* @/app/components/chat/ChatRoom.jsx */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatListSection from "./ChatListSection";
import ChatInputSection from "./ChatInputSection";
import "@/styles/chat.css";

/**
 * @typedef {import("@/utils/chat/types").AnnChat} AnnChat
 * @typedef {import("@/utils/chat/types").AnnSender} AnnSender
 * @typedef {import("@/utils/chat/types").ChatRoom} ChatRoom
 * @typedef {import("@/utils/chat/types").MessagePage} MessagePage
 */

const CHAT_POLLING = { activeIntervalMs: 500, idleIntervalMs: 10_000, idleAfterMs: 30_000 };
const CHAT_HISTORY_LIMIT = 50;
const CHAT_UPDATE_LIMIT = 100;

/**
 * Merges messages, removes duplicates, and preserves chronological order.
 * @param {AnnChat[]} current
 * @param {AnnChat[]} incoming
 * @returns {AnnChat[]}
 */
function mergeMsg(current, incoming) {
  if (!Array.isArray(incoming) || !incoming.length) { return current; }
  const msgMap = new Map(current.map(message => [message.id, message]));
  incoming.forEach(msg => { if (msg?.id) { msgMap.set(msg.id, msg); } });
  return [...msgMap.values()].sort(compareMsg);
}

function compareMsg(a, b) { return String(a.createdAt).localeCompare(String(b.createdAt)) || String(a.id).localeCompare(String(b.id)); }

/**
 * @param {{
 *   annUser: AnnSender,
 *   room: ChatRoom,
 *   annMsg: AnnChat[],
 *   initialCursors?: {oldest: string|null, latest: string|null},
 *   embedded: boolean
 * }} props
 */
export default function ChatRoom({ annUser, room, annMsg, initialCursors, embedded = false }) {
  const router = useRouter();
  const initialMessages = useRef(Array.isArray(annMsg) ? annMsg : []).current;
  const [msgs, setMsgs] = useState(initialMessages);
  const [isSending, setIsSending] = useState(false);

  const msgCursorsRef = useRef({ oldest: initialCursors?.oldest || null, latest: initialCursors?.latest || null });
  const msgBoundariesRef = useRef({ oldest: initialMessages[0] || null, latest: initialMessages.at(-1) || null });
  const isFetching = useRef(false);
  const lastActivityAtRef = useRef(Date.now());
  const scheduleNextPollRef = useRef(null);
  const isFetchingHistoryRef = useRef(false);
  const hasMoreHistoryRef = useRef(true);

  const roomId = encodeURIComponent(room.id);
  const messagesUrl = `/api/chat/rooms/${roomId}/messages`;

  /**
   * Merges messages and updates their composite cursors.
   * @param {AnnChat[]} incoming
   * @param {{oldest: string|null, latest: string|null}} cursor
   */
  const applyMessages = useCallback((incoming, cursor = {}) => {
    if (!Array.isArray(incoming) || !incoming.length) { return; }
    setMsgs(current => mergeMsg(current, incoming));

    const oldest = incoming[0];
    const latest = incoming.at(-1);
    const boundaries = msgBoundariesRef.current;
    const cursors = msgCursorsRef.current;

    if (!boundaries.oldest || compareMsg(oldest, boundaries.oldest) < 0) {
      boundaries.oldest = oldest;
      cursors.oldest = cursor.oldest || null;
    } else if (compareMsg(oldest, boundaries.oldest) === 0 && cursor.oldest) {
      cursors.oldest = cursor.oldest;
    }

    if (!boundaries.latest || compareMsg(latest, boundaries.latest) > 0) {
      boundaries.latest = latest;
      cursors.latest = cursor.latest || null;
    } else if (compareMsg(latest, boundaries.latest) === 0 && cursor.latest) {
      cursors.latest = cursor.latest;
    }
  }, []);

  /**
   * Fetches newer messages, following subsequent pages when necessary.
   * @param {AbortSignal} signal
   * @returns {Promise<boolean>}
   */
  const fetchUpdates = useCallback(async (signal) => {
    if (isFetching.current) { return false; }
    isFetching.current = true;

    try {
      let hasMore = false;
      do {
        const after = msgCursorsRef.current.latest;
        const searchParams = new URLSearchParams({ limit: String(CHAT_UPDATE_LIMIT) });
        if (after) { searchParams.set("after", after); }

        const response = await fetch(`${messagesUrl}?${searchParams}`, { method: "GET", cache: "no-store", signal });
        if (!response.ok) { return false; }

        const result = await response.json();
        if (!result.ok || signal.aborted) { return false; }

        const { messages, cursor } = result.data;
        applyMessages(messages, cursor);
        if (messages.length) { lastActivityAtRef.current = Date.now(); }

        hasMore = Boolean(after && result.data.hasMore);
        if (hasMore && (!messages.length || !msgCursorsRef.current.latest || msgCursorsRef.current.latest === after)) { return false; }
      } while (hasMore && !signal.aborted);

      return !signal.aborted;
    } catch (error) {
      if (signal.aborted || error?.name === "AbortError") { return false; }
      console.error("Chat polling failed:", { url: messagesUrl, error });
      return false;
    } finally { isFetching.current = false; }
  }, [applyMessages, messagesUrl]);

  /**
   * Loads messages older than the current oldest message.
   * @returns {Promise<boolean>}
   */
  const onTop = useCallback(async () => {
    if (embedded || isFetchingHistoryRef.current || !hasMoreHistoryRef.current || !msgCursorsRef.current.oldest) { return false; }
    isFetchingHistoryRef.current = true;

    try {
      const searchParams = new URLSearchParams({
        before: msgCursorsRef.current.oldest,
        limit: String(CHAT_HISTORY_LIMIT),
      });

      const response = await fetch(`${messagesUrl}?${searchParams}`, { method: "GET", cache: "no-store" });
      if (!response.ok) { return false; }

      const result = await response.json();
      if (!result.ok) { return false; }

      const { messages, cursor, hasMore } = result.data;
      if (!Array.isArray(messages) || !messages.length) {
        hasMoreHistoryRef.current = false;
        return false;
      }

      applyMessages(messages, cursor);
      hasMoreHistoryRef.current = hasMore;
      return true;
    } catch (error) {
      console.error("Failed to load older chat messages:", error);
      return false;
    } finally { isFetchingHistoryRef.current = false; }
  }, [applyMessages, embedded, messagesUrl]);

  useEffect(() => {
    let isPollingEnabled = true;
    let pollTimeoutId;
    let isRequestPending = false;
    let lastPollStartedAt = 0;
    let retryDelayMs = 0;
    const abortController = new AbortController();

    const getPollingInterval = () => {
      const inactiveDurationMs = Date.now() - lastActivityAtRef.current;
      const intervalMs = inactiveDurationMs < CHAT_POLLING.idleAfterMs ? CHAT_POLLING.activeIntervalMs : CHAT_POLLING.idleIntervalMs;
      return Math.max(intervalMs, retryDelayMs);
    };

    const schedulePoll = (delayMs) => {
      window.clearTimeout(pollTimeoutId);
      if (isPollingEnabled && !document.hidden) { pollTimeoutId = window.setTimeout(poll, delayMs); }
    };

    const poll = async () => {
      if (!isPollingEnabled || document.hidden || isRequestPending) { return; }
      isRequestPending = true;
      lastPollStartedAt = Date.now();

      const succeeded = await fetchUpdates(abortController.signal);
      retryDelayMs = succeeded === false ? Math.min(CHAT_POLLING.idleIntervalMs, (retryDelayMs || CHAT_POLLING.activeIntervalMs) * 2) : 0;
      isRequestPending = false;

      const requestDurationMs = Date.now() - lastPollStartedAt;
      schedulePoll(Math.max(0, getPollingInterval() - requestDurationMs));
    };

    const resumePolling = () => {
      if (isRequestPending || document.hidden) { return; }
      const elapsedSinceLastPollMs = Date.now() - lastPollStartedAt;
      schedulePoll(Math.max(0, Math.max(CHAT_POLLING.activeIntervalMs, retryDelayMs) - elapsedSinceLastPollMs));
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

  /**
   * Sends a message and merges the anonymized response.
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  const sendMessage = useCallback(async (text) => {
    if (isSending) { return false; }
    setIsSending(true);

    try {
      const response = await fetch(messagesUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        console.error(result.error || "Failed to send message");
        return false;
      }

      applyMessages([result.data]);
      lastActivityAtRef.current = Date.now();
      scheduleNextPollRef.current?.();
      return true;
    } catch (error) {
      console.error("Failed to send chat message:", error);
      return false;
    } finally { setIsSending(false); }
  }, [applyMessages, isSending, messagesUrl]);

  const handleClick = useCallback(() => {
    if (embedded) { router.push(`/chat/${roomId}`); }
  }, [embedded, roomId, router]);

  return (
    <section className={`chat-room ${embedded ? "chat-room--embedded" : ""}`} onClickCapture={handleClick}>
      <ChatListSection messages={msgs} userHash={annUser.hash} onTop={onTop} />
      <ChatInputSection sender={annUser} sending={isSending} onSend={sendMessage} />
    </section>
  );
}
