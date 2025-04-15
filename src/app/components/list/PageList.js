"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/components/list/pagelist.css";

export default function PageList({ boardName, posts, uploader }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div id="page-list-container">
      <ul className="page-list">
        {posts.map((post) => (
          <li key={post.id} className="page-item" onClick={() => setSelectedId(post.id)}>
            <img src={"/image/ico/file.png"} alt="File Icon" className="file-icon" />
            <Link href={`/text/${boardName}/view/${post.id}`} className="page-link">
              {selectedId === post.id
               ? (<img src="/image/filelist/interacting.png" alt="interacting..." className="loading-icon" />)
               : (<span className="page-title">{post.title}</span> )}
              {/* <span className="page-date">{post.createDate.slice(2, 10)}</span> */}
            </Link>

            <div className="page-buttons">
              {uploader?.email === post.uploaderEmail
              ? (<Link href={`/text/${boardName}/modify/${post.id}`} className="modify-link">수정</Link>)
              : (<span className="page-date">{post.createDate.slice(2, 10)}</span>)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}