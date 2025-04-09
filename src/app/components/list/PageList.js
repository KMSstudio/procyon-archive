"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/components/list/pagelist.css";

export default function PageList({ boardName, posts }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div id="page-list-container">
      <ul className="page-list">
        {posts.map((post) => (
          <li key={post.id} className="page-item" onClick={() => setSelectedId(post.id)}>
            <img src={"/image/ico/file.png"} alt="File Icon" className="file-icon" />
            <Link href={`/text/${boardName}/view/${post.driveId}`} className="page-link">
              {selectedId === post.id
               ? (<img src="/image/filelist/interacting.png" alt="interactong..." className="loading-icon" />)
               : (<span className="page-title">{post.title}</span> )}
              <span className="page-uploader">{post.createDate.slice(0, 16)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}