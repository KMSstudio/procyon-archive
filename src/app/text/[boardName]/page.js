// @/app/board/[boardName]/list/page.js

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

      <ul>
        {posts.map((post) => (
          <li key={post.id} style={{ marginBottom: "12px" }}>
            <Link href={`/text/${boardName}/view/${post.driveId}`}>
              <strong>{post.title}</strong> —{" "}
              <span style={{ color: "#888" }}>{post.uploaderName}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      <Link href={`/text/${boardName}/write`} className="write-link">
        Write an article
      </Link>
    </div>
  );
}