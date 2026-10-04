/* @/app/components/chat/ChatListSection.jsx */

"use client";

import { useLayoutEffect, useMemo, useRef } from "react";

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
    const prevGroup = groups[groups.length - 1];

    if (sender.hash && prevGroup?.sender.hash === sender.hash) {
      prevGroup.messages.push(message);
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
  const htmlRef = useRef(null);
  const scrollSnapshot = useRef(null);

  const groupedMessages = useMemo(
    () => groupMessages(messages),
    [messages]
  );

  // Set the scroll position to the bottom during the initial render.
  useLayoutEffect(() => {
    const container = htmlRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, []);

  // Amend the scroll position when the message list changes.
  useLayoutEffect(() => {
    const container = htmlRef.current;
    if (!container) return;
    if (scrollSnapshot.current) {
      const { height, top } = scrollSnapshot.current;
      container.scrollTop =
        top + container.scrollHeight - height;
      scrollSnapshot.current = null;
    } else {
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
    }
  }, [messages]);

  // Load older messages when the user scrolls beyond the top of the chat.
  const handleWheel = async (event) => {
    const container = event.currentTarget;
    if (container.scrollTop > 0 || event.deltaY >= 0 || scrollSnapshot.current ) { return; }
    scrollSnapshot.current = {
      height: container.scrollHeight,
      top: container.scrollTop,
    };
    const loaded = await onTop();
    if (!loaded) { scrollSnapshot.current = null; }
  };

  return (
    <section ref={htmlRef} className="chat-list-section" onWheel={handleWheel}>
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
