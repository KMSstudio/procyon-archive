/* app/chat/[id]/ChatListSection.jsx */

"use client";

import { useEffect, useMemo, useRef } from "react";

function groupMessages(messages) {
  return messages.reduce((groups, message) => {
    const previous = groups[groups.length - 1];
    const senderKey = message.sender?.email || message.sender?.name || "unknown";

    if (previous?.senderKey === senderKey) {
      previous.messages.push(message);
      return groups;
    }

    groups.push({
      senderKey,
      sender: message.sender || {},
      messages: [message],
    });

    return groups;
  }, []);
}

function ChatMessageGroup({ group, currentUserEmail }) {
  const isMine = group.sender.email === currentUserEmail;

  return (
    <article className={`chat-group ${isMine ? "chat-group--mine" : ""}`}>
      <div className="chat-avatar" aria-hidden="true">
        {group.sender.name?.slice(0, 1) || "?"}
      </div>

      <div className="chat-group__content">
        <header className="chat-sender">
          <span>{group.sender.name || "Unknown"}</span>

          {group.sender.major && (
            <>
              <span className="chat-sender__divider">/</span>
              <span>{group.sender.major}</span>
            </>
          )}
        </header>

        <div className="chat-messages">
          {group.messages.map(message => (
            <div key={message.id} className="chat-message">
              <p>{message.text}</p>
              <time dateTime={message.createdAt}>{message.createdAt}</time>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ChatListSection({ messages, currentUserEmail }) {
  const containerRef = useRef(null);
  const groupedMessages = useMemo(() => groupMessages(messages), [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    if (distanceFromBottom < 300) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <section ref={containerRef} className="chat-list-section">
      <div className="chat-list">
        {groupedMessages.map(group => (
          <ChatMessageGroup
            key={`${group.senderKey}-${group.messages[0]?.id}`}
            group={group}
            currentUserEmail={currentUserEmail}
          />
        ))}

        {!groupedMessages.length && (
          <div className="chat-empty">No messages yet.</div>
        )}
      </div>
    </section>
  );
}
