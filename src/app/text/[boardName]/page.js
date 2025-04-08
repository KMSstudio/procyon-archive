// @/app/board/[boardName]/list/page.js
import { getRecentDBTexts } from "@/utils/database/textDB";
import Link from "next/link";

export default async function BoardListPage({ params }) {
  const { boardName } = params;
  const posts = await getRecentDBTexts(boardName, 40, 1);

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h1 style={{ fontSize: "24px" }}>{boardName}</h1>
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
      <Link href={`/text/${boardName}/write`}>
        <button style={{ marginTop: "20px" }}>글쓰기</button>
      </Link>
    </div>
  );
}