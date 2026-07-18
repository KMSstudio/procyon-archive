/* app/components/chat/ChatPageClient.js */

"use client";

import { useEffect, useRef, useState } from "react";

export default function ChatPageClient({ userData, defaultRoomId = "general" }) {
  const [roomInput, setRoomInput] = useState(defaultRoomId);
  const [roomId, setRoomId] = useState(defaultRoomId);
  const [messages, setMessages] = useState([]);
  const [latest, setLatest] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const latestRef = useRef(null);
  const pollingRef = useRef(null);
  const pollingTokenRef = useRef(0);
  const bottomRef = useRef(null);

  const senderName = userData.fullName;

  useEffect(() => { latestRef.current = latest; }, [latest]);

  useEffect(() => {
    loadMessages(roomId);

    return () => {
      pollingTokenRef.current += 1;
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [roomId]);

  function enterRoom(event) {
    event.preventDefault();

    const nextRoomId = roomInput.trim();
    if (!/^[a-zA-Z0-9_-]{1,50}$/.test(nextRoomId)) {
      alert("roomId는 영문, 숫자, _, - 만 사용할 수 있습니다.");
      return;
    }

    setRoomId(nextRoomId);
  }

  async function loadMessages(targetRoomId) {
    pollingTokenRef.current += 1;
    if (pollingRef.current) clearTimeout(pollingRef.current);

    setLoading(true);
    setMessages([]);
    setLatest(null);
    latestRef.current = null;

    try {
      const res = await fetch(`/api/chat/rooms/${encodeURIComponent(targetRoomId)}/msg?limit=50`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to load messages");

      const loadedMessages = json.data.messages || [];
      const nextLatest = json.data.cursor?.latest || null;

      setMessages(loadedMessages);
      setLatest(nextLatest);
      latestRef.current = nextLatest;

      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "auto" }), 0);
      startPolling(targetRoomId);
    } catch (error) {
      console.error("Load chat error:", error);
      alert(`채팅방을 불러오지 못했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function startPolling(targetRoomId) {
    const token = pollingTokenRef.current;

    async function pool() {
      if (token !== pollingTokenRef.current) return;

      try {
        const after = latestRef.current;
        const query = after ? `?after=${encodeURIComponent(after)}` : "";
        const res = await fetch(`/api/chat/rooms/${encodeURIComponent(targetRoomId)}/poll${query}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok || !json.ok) throw new Error(json.error || "Failed to pool messages");

        const newMessages = json.data.messages || [];
        if (token === pollingTokenRef.current && newMessages.length > 0) {
          setMessages(prev => {
            const seen = new Set(prev.map(message => message.id));
            return [...prev, ...newMessages.filter(message => !seen.has(message.id))];
          });

          setLatest(json.data.latest);
          latestRef.current = json.data.latest;

          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
        }
      } catch (error) {
        console.error("Pooling error:", error);
      }

      if (token === pollingTokenRef.current) {
        pollingRef.current = setTimeout(pool, document.hidden ? 5000 : 1500);
      }
    }

    pool();
  }

  async function sendMessage(event) {
    event.preventDefault();

    const value = text.trim();
    if (!value || sending) return;

    setSending(true);
    setText("");

    try {
      const res = await fetch(`/api/chat/rooms/${encodeURIComponent(roomId)}/msg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value, roomName: roomId }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Failed to send message");

      const message = json.data.message;

      setMessages(prev => {
        const seen = new Set(prev.map(item => item.id));
        return seen.has(message.id) ? prev : [...prev, message];
      });

      setLatest(message.createdAt);
      latestRef.current = message.createdAt;

      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    } catch (error) {
      console.error("Send message error:", error);
      setText(value);
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Test Chat</h1>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: 12, borderBottom: "1px solid #eee", background: "#fafafa" }}>
          <strong>{roomId}</strong> <span style={{ color: "#777" }}>· {loading ? "loading..." : "connected"}</span>
        </div>

        <div style={{ padding: 12, borderBottom: "1px solid #eee", color: "#666" }}>
          사용자: <strong>{senderName}</strong>
        </div>

        <div style={{ height: 460, overflowY: "auto", padding: 16 }}>
          {messages.length === 0 ? (
            <p style={{ color: "#777" }}>아직 메시지가 없습니다.</p>
          ) : messages.map(message => (
            <div key={message.id} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: "#666" }}>
                <strong>{message.senderName || "Unknown"}</strong> · {message.createdAt}
              </div>
              <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{message.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee" }}>
          <input
            value={text}
            onChange={event => setText(event.target.value)}
            placeholder="메시지를 입력하세요"
            style={{ flex: 1, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            style={{ padding: "0 18px", border: "1px solid #ddd", borderRadius: 8, opacity: sending ? 0.6 : 1 }}
          >
            {sending ? "전송 중" : "전송"}
          </button>
        </form>
      </section>
    </main>
  );
}
