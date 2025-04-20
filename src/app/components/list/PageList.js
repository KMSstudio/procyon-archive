"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/components/list/pagelist.css";
// import boardConfig from "@/config/board-config.json";

export default function PageList({ boardName, posts }) {
  const [selectedId, setSelectedId] = useState(null);
  // const boardMeta = boardConfig[boardName];

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
            </Link>

            <div className="page-buttons">
              <span className="page-date">{post.createDate.slice(2, 10)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}