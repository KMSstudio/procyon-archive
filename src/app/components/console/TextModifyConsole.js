// @/app/components/console/TextModifyConsole.js

"use client";

// React
import { useState } from "react";
// Next
import { useRouter } from "next/navigation";
// Style (CSS)
import "@/styles/components/console/textwriteconsole.css";

export default function TextModifyConsole({ pageId, boardName, title: initTitle, markdown, setMarkdown }) {
  const router = useRouter();
  const [title, setTitle] = useState(initTitle);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/text/modify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        boardName,
        textId: pageId,
        newTitle: title,
        newMarkdown: markdown,
      }),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/text/${boardName}/view/${pageId}`);
    } else {
      alert("수정 실패: " + data.error);
      setLoading(false);
    }
  };

  return (
    <form id="write-console" onSubmit={handleSubmit}>
      <h2 className="write-title">/{boardName} 글 수정</h2>

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
        {loading ? "수정 중..." : "수정 완료"}
      </button>
    </form>
  );
}