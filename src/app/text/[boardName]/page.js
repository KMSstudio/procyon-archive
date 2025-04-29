// @/app/text/[boardName]/page.js

// Next
import Link from "next/link";
// Components
import PageList from "@/app/components/list/PageList";
// Constants
import boardConfig from "@/config/board-config.json";
// Utils
import { getUserv2 } from "@/utils/auth";
import { getRecentDBTexts } from "@/utils/database/textDB";
import logger from "@/utils/logger";

export default async function BoardListPage({ params }) {
  const { boardName } = params;
  const posts = await getRecentDBTexts(boardName, 40, 1);
  
  const uploader = await getUserv2();

  const boardMeta = boardConfig[boardName];
  const displayName = boardMeta?.displayName || boardName;
  
  logger.behavior(uploader.fullName, "게시판 리스트 조회", `${displayName}:${boardName}`)

  return (
    <div className="container">
      <header>
        <h1>{displayName}</h1>
      </header>
      <PageList boardName={boardName} posts={posts} />
      <div id="view-page-buttons">
        {(!boardMeta?.writeOnlyAdmin || uploader?.admin) && (
          <a href={`/text/${boardName}/write`} className="write-link"><button>Write an article</button></a>
        )}
        <a href={`/text`} className="write-link"><button>Go to Main</button></a>
      </div>
    </div>
  );
}