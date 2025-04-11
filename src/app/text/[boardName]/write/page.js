"use client";

// Next
import { useState } from "react";
// Component
import MarkdownView from "../MarkdownView";
import TextWriteConsole from "@/app/components/console/TextWriteConsole";
// Style
import "@/styles/text.css";

export default function BoardWritePage({ params }) {
  const { boardName } = params;
  const [markdown, setMarkdown] = useState("");

  return (
    <main id="write-container">
      {/* Console Section */}
      <TextWriteConsole
        boardName={boardName}
        markdown={markdown}
        setMarkdown={setMarkdown}
      />

      {/* Preview Section */}
      <div id="write-preview">
        <h2 className="preview-title">프리뷰</h2>
        <div className="preview-content">
          <MarkdownView content={markdown} />
        </div>
      </div>
    </main>
  );
}