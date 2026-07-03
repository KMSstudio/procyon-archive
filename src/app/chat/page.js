/* app/chat/page.js */

"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_ROOM_ID = "general";

export default function ChatPage() {
  const [roomId, setRoomId] = useState(DEFAULT_ROOM_ID);
  const [activeRoomId, setActiveRoomId] = useState(DEFAULT_ROOM_ID);
  const [messages, setMessages] = useState([]);
  const [latest, setLatest] = useState(null);
  const [text, setText] = useState("");
  const [senderName, setSenderName] = useState("Anonymous");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const latestRef = useRef(null);
  const pollingRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => { latestRef.current = latest; }, [latest]);

  useEffect(() => {
    loadMessages(activeRoomId);
    return () => { if (pollingRef.current) clearTimeout(pollingRef.current); };
  }, [activeRoomId]);

  async function loadMessages(targetRoomId) {
    setLoading(true);
    setMessages([]);
    setLatest(null);

    try {
      await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: targetRoomId, roomName: targetRoomId }),
      });

      const res = await fetch(`/api/chat/rooms/${encodeURIComponent(targetRoomId)}/msg?limit=50`, { cache: "no-store" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to load messages");

      const loadedMessages = json.data.messages || [];
      setMessages(loadedMessages);
      setLatest(json.data.cursor?.latest || null);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "auto" }), 0);
      startPolling(targetRoomId);
    } catch (error) {
      console.error("Load chat error:", error);
      alert("채팅방을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function startPolling(targetRoomId) {
    if (pollingRef.current) clearTimeout(pollingRef.current);

    let stopped = false;

    async function poll() {
      try {
        const after = latestRef.current;
        const query = after ? `?after=${encodeURIComponent(after)}` : "";
        const res = await fetch(`/api/chat/rooms/${encodeURIComponent(targetRoomId)}/poll${query}`, { cache: "no-store" });
        const json = await res.json();

        if (!json.ok) throw new Error(json.error || "Failed to poll messages");

        const newMessages = json.data.messages || [];
        if (!stopped && newMessages.length > 0) {
          setMessages(prev => {
            const seen = new Set(prev.map(message => message.id));
            return [...prev, ...newMessages.filter(message => !seen.has(message.id))];
          });
          setLatest(json.data.latest);
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }

      if (!stopped) pollingRef.current = setTimeout(poll, document.hidden ? 5000 : 1500);
    }

    poll();

    return () => { stopped = true; };
  }

  async function sendMessage(event) {
    event.preventDefault();

    const value = text.trim();
    if (!value || sending) return;

    setSending(true);
    setText("");

    try {
      const res = await fetch(`/api/chat/rooms/${encodeURIComponent(activeRoomId)}/msg`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value, senderName, senderEmail: "test@example.com", roomName: activeRoomId }),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed to send message");

      const message = json.data.message;
      setMessages(prev => {
        const seen = new Set(prev.map(item => item.id));
        return seen.has(message.id) ? prev : [...prev, message];
      });
      setLatest(message.createdAt);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    } catch (error) {
      console.error("Send message error:", error);
      setText(value);
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setSending(false);
    }
  }

  function enterRoom(event) {
    event.preventDefault();
    const nextRoomId = roomId.trim();
    if (!/^[a-zA-Z0-9_-]{1,50}$/.test(nextRoomId)) {
      alert("roomId는 영문, 숫자, _, - 만 사용할 수 있습니다.");
      return;
    }
    setActiveRoomId(nextRoomId);
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Test Chat</h1>

      <form onSubmit={enterRoom} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={roomId}
          onChange={event => setRoomId(event.target.value)}
          placeholder="roomId"
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button type="submit" style={{ padding: "0 16px", border: "1px solid #ddd", borderRadius: 8 }}>
          입장
        </button>
      </form>

      <label style={{ display: "block", marginBottom: 12 }}>
        <span style={{ display: "block", marginBottom: 4 }}>이름</span>
        <input
          value={senderName}
          onChange={event => setSenderName(event.target.value)}
          placeholder="Your name"
          style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
      </label>

      <section style={{ border: "1px solid #ddd", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
        <div style={{ padding: 12, borderBottom: "1px solid #eee", background: "#fafafa" }}>
          <strong>Room:</strong> {activeRoomId} {loading ? "· loading..." : ""}
        </div>

        <div style={{ height: 460, overflowY: "auto", padding: 16 }}>
          {messages.length === 0 ? (
            <p style={{ color: "#777" }}>아직 메시지가 없습니다.</p>
          ) : messages.map(message => (
            <div key={message.id} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: "#666" }}>
                <strong>{message.senderName || "Anonymous"}</strong> · {message.createdAt}
              </div>
              <div style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{message.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </section>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8 }}>
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
    </main>
  );
}
