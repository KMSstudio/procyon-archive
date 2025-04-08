// @/app/board/notice/view/[pageId]/page.js

import { getDriveText } from "@/utils/drive/text";
import { parseMarkdown } from "@/utils/markdown";
import "katex/dist/katex.min.css";

export default async function NoticeViewPage({ params }) {
  const { pageId } = params;
  const markdown = await getDriveText(pageId);
  if (!markdown) return <div>We Cannot Found File.</div>;

  const html = await parseMarkdown(markdown);

  return (
    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
}