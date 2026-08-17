/* @/app/components/chat/ChatInputSection.jsx */

"use client";

import { useState } from "react";

/**
 * チャットメッセージの入力と送信を管理します。
 *
 * @param {{
 *   sender: AnnSender,
 *   sending: boolean,
 *   onSend: (text: string) => Promise<boolean>
 * }} props
 */
export default function ChatInputSection({ sender, sending, onSend }) {
  const [text, setText] = useState("");

  const submit = async () => {
    if (text.length === 0 || sending) return;
    const m = text; setText("");
    const success = await onSend(m);
    if (!success) { setText(current => current.length ? current : m); }
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;
    if (event.shiftKey || event.altKey) return;
    event.preventDefault();
    submit();
  };

  return (
    <section className="chat-input-section">
      <div className="chat-input-inner">
        <div className="chat-input__user">
          <span>{sender.nickname || "Unknown"}</span>
          {sender.major && <span> | {sender.major}</span>}
        </div>

        <textarea
          className="chat-input"
          value={text}
          rows={1}
          placeholder="Message"
          aria-label="Message"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </section>
  );
}
