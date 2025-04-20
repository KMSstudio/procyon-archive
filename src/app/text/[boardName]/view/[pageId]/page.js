// @/app/text/[boardName]/view/[pageId]/page.js

// Utils
import { getDriveText } from "@/utils/drive/text";
import { parseMarkdown } from "@/utils/markdown";
import { getDBText } from "@/utils/database/textDB";
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger"
// Constants
import boardConfig from "@/config/board-config.json";
// Style
import "katex/dist/katex.min.css";
import "@/styles/text.css";

export default async function NoticeViewPage({ params }) {
  const { boardName, pageId } = params;
  const userData = await getUserv2();
  const boardMeta = boardConfig[boardName];
  
  const textData = await getDBText(boardName, pageId);
  if (!textData) { return <div className="container">We Cannot Find the Post Metadata.</div>; }

  const { title, driveId } = textData;
  const markdown = await getDriveText(driveId);
  if (!markdown) { return <div className="container">We Cannot Load the Markdown Content.</div>; }

  const html = await parseMarkdown(markdown);
  logger.behavior(uploader.fullName, "게시판 글 조회", `${title}:${pageId}`)

  return (
    <div className="container">
      {/* Markdown Section */}
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      {/* Button Section (Under Markdown) */}
      <div id="view-page-buttons">
        <a href={`/text/${boardName}`} className="button-link"><button>Go to pagelist</button></a>
        {(userData?.email === textData.uploaderEmail || !boardMeta?.modifyOnlyAuthor)
          && <a href={`/text/${boardName}/modify/${pageId}`} className="button-link"><button>Modify this page</button></a>
        }
      </div>
    </div>
  );
}