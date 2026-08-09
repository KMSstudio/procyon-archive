/* app/chat/[id]/ChatInputSection.jsx */

"use client";

import { useRef, useState } from "react";

/**
 * チャットメッセージ入力欄を表示するコンポーネントです。
 * 入力されたメッセージを管理し、送信処理を実行します。
 *
 * @param {{
 *   userData: Object,
 *   disabled: boolean,
 *   onSend: (text: string) => Promise<boolean>
 * }} props
 */
export default function ChatInputSection({ userData, disabled, onSend }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const submit = async () => {
    if (text.length === 0 || disabled) return;
    const m = text; setText("");
    const success = await onSend(m);
    if (!success) { setText(m); inputRef.current?.focus(); }
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
          <span>
            {userData.name || "Unknown"}
          </span>

          {userData.major && (
            <span> / {userData.major}</span>
          )}
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
