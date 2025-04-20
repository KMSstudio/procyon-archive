// @/app/components/console/TextWriteConsole.js

"use client";

// React
import { useState } from "react";
import { useRouter } from "next/navigation";
// Style (CSS)
import "@/styles/components/console/textwriteconsole.css"

export default function TextWriteConsole({ boardName, markdown, setMarkdown }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/text/write`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardName, title, markdown }),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/text/${boardName}/view/${data.id}`); 
    } else {
      alert("Upload failed: " + data.error);
      setLoading(false);
    }
  };

  return (
    <form id="write-console" onSubmit={handleSubmit}>
      <h2 className="write-title">/{boardName} 글 작성</h2>

      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="title-input"
      />
      <textarea
        placeholder="마크다운으로 글을 작성하세요..."
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="markdown-input"
        required
      />
      <button type="submit" disabled={loading} className="submit-button">
        {loading ? "업로드 중..." : "작성 완료"}
      </button>
    </form>
  );
}