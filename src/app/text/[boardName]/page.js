// @/app/board/[boardName]/list/page.js

// Components
import PageList from "@/app/components/list/PageList";
// Utils
import { getRecentDBTexts } from "@/utils/database/textDB";
// Link import in Next
import Link from "next/link";

export default async function BoardListPage({ params }) {
  const { boardName } = params;
  const posts = await getRecentDBTexts(boardName, 40, 1);

  return (
    <div className="container">
      <header>
        <h1>{boardName}</h1>
      </header>
      <PageList boardName={boardName} posts={posts} />
      <Link href={`/text/${boardName}/write`} className="write-link">
        Write an article
      </Link>
    </div>
  );
}