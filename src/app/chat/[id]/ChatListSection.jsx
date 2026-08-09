/* app/chat/[id]/ChatListSection.jsx */

"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * @typedef {import("@/app/chat/types").ChatMessage} ChatMessage
 */

function groupMessages(messages) {
  return messages.reduce((groups, message) => {
    const sender = message.sender || {};
    const prevG = groups[groups.length - 1];
    if (sender.email && prevG?.sender.email === sender.email) { 
      prevG.messages.push(message); }
    else { groups.push({ sender, messages: [message]}); }
    return groups;
  }, []);
}

function ChatMessageGroup({group, email}) {
  const isMine = group.sender.email === email;
  return (
    <article className={`chat-group ${isMine ? "chat-group--mine" : ""}`}>
      <div className="chat-avatar" aria-hidden="true">
        {group.sender.name?.slice(0, 3) || "?"}
      </div>

      <div className="chat-group__body">
        <header className="chat-sender">
          <span>{group.sender.name || "Unknown"}</span>
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
 *   messages: ChatMessage[],
 *   email: string
 * }} props
 */
export default function ChatListSection({ messages, email }) {
  const containerRef = useRef(null);

  const groupedMessages = useMemo(
    () => groupMessages(messages),
    [messages]
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const distanceFromBottom =  
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    if (distanceFromBottom < 200) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <section ref={containerRef} className="chat-list-section">
      <div className="chat-list">
        {groupedMessages.map((group) => (
          <ChatMessageGroup
            key={`${group.senderKey}-${group.messages[0]?.id}`}
            group={group}
            email={email}
          />
        ))}

        {groupedMessages.length === 0 && (
          <div className="chat-empty">No messages yet.</div>
        )}
      </div>
    </section>
  );
}
