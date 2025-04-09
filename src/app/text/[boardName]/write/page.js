"use client";

// Next
import { useState } from "react";
import { useRouter } from "next/navigation";
// Component
import MarkdownView from "../MarkdownView";
// Style
import "./boardwrite.css";

export default function BoardWritePage({ params }) {
  const { boardName } = params;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
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
      router.push(`/text/${boardName}/view/${data.driveId}`);
    } else {
      alert("Upload failed: " + data.error);
      setLoading(false);
    }
  };

  return (
    <main id="write-container">
      {/* Console Section */}
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
          rows={20}
          className="markdown-input"
          required
        />

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "업로드 중..." : "작성 완료"}
        </button>
      </form>

      {/* Preview Section */}
      <div className="write-preview">
        <h2 className="preview-title">Preview 임마</h2>
        <div className="preview-content">
          <MarkdownView content={markdown} />
        </div>
      </div>
    </main>
  );
}