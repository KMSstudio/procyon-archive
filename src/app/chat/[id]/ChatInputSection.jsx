/* app/chat/[id]/ChatInputSection.jsx */

"use client";

import { useRef, useState } from "react";

export default function ChatInputSection({ userData, disabled, onSend }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const submit = async () => {
    const trimmedText = text.trim();
    if (!trimmedText || disabled) return;

    setText("");
    const success = await onSend(trimmedText);

    if (!success) {
      setText(trimmedText);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = event => {
    if (event.key !== "Enter") return;
    if (event.shiftKey || event.altKey) return;

    event.preventDefault();
    submit();
  };

  return (
    <section className="chat-input-section">
      <div className="chat-input__user">
        <span>{userData.name || "Unknown"}</span>
        {userData.major && <span> / {userData.major}</span>}
      </div>

      <textarea
        ref={inputRef}
        className="chat-input"
        value={text}
        rows={1}
        disabled={disabled}
        placeholder="Message"
        aria-label="Message"
        onChange={event => setText(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </section>
  );
}
