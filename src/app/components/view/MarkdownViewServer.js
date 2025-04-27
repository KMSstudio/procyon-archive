// @/app/components/view/markdownViewServer.js

// Utils (Markdown Converter)
import { parseMarkdown } from "@/utils/markdown";
// Style for expression
import "katex/dist/katex.min.css";
import "@/styles/components/view/markdown.css";

export default async function MarkdownViewServer({ content }) {
  if (typeof content !== "string" || !content.trim()) { return <div id="markdown-body"></div>; }
  const html = await parseMarkdown(content);
  return (
    <div className="wrapper">
      <div id="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}