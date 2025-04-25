/* @/app/text/[boardName]/MarkdownView.js */

"use client";

// State
import { useState, useEffect } from "react";
// Style for expression
import "katex/dist/katex.min.css";
import "@/styles/components/view/markdown.css"

export default function MarkdownViewClient({ content }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    console.log("call");
    const fetchPreview = async () => {
      const res = await fetch("/api/text/markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: content || "" }),
      });

      const data = await res.json();
      if (data.success) { setHtml(data.html); }
      else { setHtml(`<p style="color:red;">Markdown parse failed</p>`); }
    };

    if (typeof content === "string" && content.trim()) { fetchPreview(); }
    else { setHtml(""); }
  }, [content]);

  return (
    <div id="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
}