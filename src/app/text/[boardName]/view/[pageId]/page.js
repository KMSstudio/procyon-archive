// @/app/text/[boardName]/view/[pageId]/page.js

import { getDriveText } from "@/utils/drive/text";
import { parseMarkdown } from "@/utils/markdown";
// Utils
import { getDBText } from "@/utils/database/textDB";
// Style
import "katex/dist/katex.min.css";
import "@/styles/text.css";

export default async function NoticeViewPage({ params }) {
  const { boardName, pageId } = params;
  
  const textData = await getDBText(boardName, pageId);
  if (!textData) { return <div className="container">We Cannot Find the Post Metadata.</div>; }

  const { title, driveId } = textData;
  const markdown = await getDriveText(driveId);
  if (!markdown) { return <div className="container">We Cannot Load the Markdown Content.</div>; }

  const html = await parseMarkdown(markdown);

  return (
    <div className="container">
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      
    </div>
  );
}