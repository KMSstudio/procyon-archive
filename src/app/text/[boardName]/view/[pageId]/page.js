// @/app/text/[boardName]/view/[pageId]/page.js

// Utils
import { getDriveText } from "@/utils/drive/text";
import { getDBText } from "@/utils/database/textDB";
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger"
// Components
import MarkdownViewServer from "@/app/components/view/MarkdownViewServer";
import TrackClient from "@/app/components/MixPanel";
// Constants
import boardConfig from "@/config/board-config.json";
// Style
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

  logger.behavior(userData.fullName, "게시판 글 조회", `${title}:${pageId}`)

  return (
    <div className="container">
      {/* Track Client Section */}
      <TrackClient
        user={{ email: userData.email, admin: userData.admin }}
        eventName={`Text Page Viewed: /text/${boardName}/${pageId} (${title})`}
      />
      {/* Markdown Section */}
      <MarkdownViewServer content={markdown} />
      {/* Button Section (Under Markdown) */}
      <div id="view-page-buttons" className="bordered">
        <a href={`/text/${boardName}`} className="button-link"><button>Go to pagelist</button></a>
        {(userData?.email === textData.uploaderEmail || !boardMeta?.modifyOnlyAuthor)
          && <a href={`/text/${boardName}/modify/${pageId}`} className="button-link"><button>Modify this page</button></a>
        }
      </div>
    </div>
  );
}