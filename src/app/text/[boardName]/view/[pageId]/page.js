// @/app/text/[boardName]/view/[pageId]/page.js

import { getDriveText } from "@/utils/drive/text";
import { parseMarkdown } from "@/utils/markdown";
// Style
import "katex/dist/katex.min.css";
import "@/styles/text.css";

export default async function NoticeViewPage({ params }) {
  const { pageId } = params;
  const markdown = await getDriveText(pageId);
  if (!markdown) return <div>We Cannot Found File.</div>;

  const html = await parseMarkdown(markdown);

  return (
    <div className="container">
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}