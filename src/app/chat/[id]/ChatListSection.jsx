/* app/chat/[id]/ChatListSection.jsx */

"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * @typedef {import("@/utils/chat/types").AnnChatMsg} AnnChatMsg
 */

/**
 * 連続する同一送信者のメッセージをグループ化します。
 *
 * @param {AnnChatMsg[]} messages
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
 *   group: { sender: AnnChatMsg["sender"], messages: AnnChatMsg[] },
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
 *   messages: AnnChatMsg[],
 *   userHash: string
 * }} props
 */
export default function ChatListSection({ messages, userHash }) {
  const containerRef = useRef(null);
  const firstRenderRef = useRef(true);
  const groupedMessages = useMemo(() => groupMessages(messages), [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (firstRenderRef.current) {
      container.scrollTop = container.scrollHeight;
      firstRenderRef.current = false;
      return;
    }
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 200) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" }); }
  }, [messages]);

  return (
    <section ref={containerRef} className="chat-list-section">
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
