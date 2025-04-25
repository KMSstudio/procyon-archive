// @/app/text/[boardName]/modify/[pageId]

"use client";

// React
import { useState } from "react";
// Style
import "@/styles/text.css";
// Components
import TextModifyConsole from "@/app/components/console/TextModifyConsole";
import MarkdownViewClient from "@/app/components/view/MarkdownViewClient";

export default function ModifyCSRPage({ pageId, boardName, title, markdown: initialMarkdown }) {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  return (
    <main id="write-container">
      {/* Console Section */}
      <TextModifyConsole
        pageId={pageId}
        boardName={boardName}
        title={title}
        markdown={markdown}
        setMarkdown={setMarkdown}
      />

      {/* Preview Section */}
      <div id="write-preview">
        <h2 className="preview-title">프리뷰</h2>
        <div className="preview-content">
          <MarkdownViewClient content={markdown} />
        </div>
      </div>
    </main>
  );
}