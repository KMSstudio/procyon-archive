/* app/chat/[id]/ChatListSection.jsx */

"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * @typedef {import("@/utils/chat/types").AnnChat} AnnChat
 * @typedef {import("@/utils/chat/types").AnnChatGroup} AnnChatGroup
 */

/**
 * @param {AnnChat[]} messages
 * @returns {AnnChatGroup[]}
 */
function groupMessages(messages) {
  return messages.reduce((groups, message) => {
    const sender = message.sender || {};
    const prevG = groups[groups.length - 1];

    if (sender.hash && prevG?.sender.hash === sender.hash) {
      prevG.messages.push(message);
    } else {
      groups.push({ sender, messages: [message] });
    }
    return groups;
  }, []);
}

/**
 * 同一送信者による連続したメッセージを表示します。
 *
 * @param {{
 *   group: AnnChatGroup,
 *   userHash: string
 * }} props
 */
function ChatMessageGroup({ group, userHash }) {
  const isMine = group.sender.hash === userHash;

  return (
    <article className={`chat-group ${isMine ? "chat-group--mine" : ""}`}>
      <div className="chat-avatar" aria-hidden="true">
        {group.sender.nickname?.slice(0, 3) || "?"}
      </div>

      <div className="chat-group__body">
        <header className="chat-sender">
          <span>{group.sender.nickname || "Unknown"}</span>
          <span className="chat-sender__divider">|</span>
          <span>{group.sender.major || "??"}</span>
        </header>

        <div className="chat-messages">
          {group.messages.map((message) => (
            <div key={message.id} className="chat-message">
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

/**
 * チャットメッセージ一覧を表示し、メッセージ更新時のスクロールを管理します。
 *
 * @param {{
 *   messages: AnnChat[],
 *   userHash: string,
 *   onTop: () => Promise<boolean>
 * }} props
 */
export default function ChatListSection({ messages, userHash, onTop }) {
  const listRef = useRef(null);
  const isFirstRender = useRef(true);
  const isLoadingMore = useRef(false);
  const predenfScroll = useRef(null);
  const groupedMessages = useMemo(() => groupMessages(messages), [messages]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const handleWheel = async (event) => {
      if (container.scrollTop > 0 || event.deltaY >= 0 || isLoadingMore.current) return;
      isLoadingMore.current = true;
      predenfScroll.current = { height: container.scrollHeight, top: container.scrollTop };
      const loaded = await onTop();
      if (!loaded) {
        predenfScroll.current = null;
        isLoadingMore.current = false;
      }
    };
    container.addEventListener("wheel", handleWheel);
    return () => container.removeEventListener("wheel", handleWheel);
  }, [onTop]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    if (isFirstRender.current) {
      container.scrollTop = container.scrollHeight;
      isFirstRender.current = false;
      return;
    }

    if (predenfScroll.current) {
      const { height, top } = predenfScroll.current;
      container.scrollTop = top + container.scrollHeight - height;
      predenfScroll.current = null;
      isLoadingMore.current = false;
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 200) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" }); }
  }, [messages]);

  return (
    <section ref={listRef} className="chat-list-section">
      <div className="chat-list">
        {groupedMessages.map((group) => (
          <ChatMessageGroup
            key={`${group.sender.hash}-${group.messages[0]?.id}`}
            group={group}
            userHash={userHash}
          />
        ))}

        {groupedMessages.length === 0 && (
          <div className="chat-empty">No messages yet.</div>
        )}
      </div>
    </section>
  );
}
