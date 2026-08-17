/* app/chat/[id]/ChatInputSection.jsx */

"use client";

import { useRef, useState, useEffect } from "react";

/**
 * チャットメッセージの入力と送信を管理します。
 *
 * @param {{
 *   sender: AnnSender,
 *   disabled: boolean,
 *   onSend: (text: string) => Promise<boolean>
 * }} props
 */
export default function ChatInputSection({ sender, disabled, onSend }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const submit = async () => {
    if (text.length === 0 || disabled) return;
    const m = text; setText("");
    const success = await onSend(m);
    if (!success) { setText(m); }
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;
    if (event.shiftKey || event.altKey) { return; }
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
          ref={inputRef}
          className="chat-input"
          value={text}
          rows={1}
          disabled={disabled}
          placeholder="Message"
          aria-label="Message"
          onChange={(event) =>
            setText(event.target.value)
          }
          onKeyDown={handleKeyDown}
        />
      </div>
    </section>
  );
}
