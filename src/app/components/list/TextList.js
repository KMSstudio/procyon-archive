"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/components/list/textlist.css";

function TextSearchConsole({ boards, setSearchResult }) {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchInput(keyword);
  
    const filteredBoards = Object.entries(boards).reduce((acc, [key, value]) => {
      if (value.displayName.toLowerCase().includes(keyword)) { acc[key] = value; }
      return acc;
    }, {});
  
    setSearchResult(filteredBoards);
  };  

  return (
    <div id="search-section">
      <div id="left-search">
        <input
          type="text"
          placeholder="제목으로 검색"
          value={searchInput}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

function TextListDisplay({ searchResult }) {
  return (
    <div id="textlist">
      {Object.entries(searchResult).map(([boardKey, boardData]) => (
        <TextItem key={boardKey} boardKey={boardKey} boardData={boardData} />
      ))}
    </div>
  );
}

import { useRouter } from "next/navigation";

function TextItem({ boardKey, boardData }) {
  const [hoveringPost, setHoveringPost] = useState(false);
  const router = useRouter();

  const handleItemClick = () => {
    router.push(`/text/${boardKey}`);
  };

  const handlePostClick = (e, postId) => {
    // Prevent this click from bubbling up to the parent .text-item
    e.stopPropagation();
    router.push(`/text/${boardKey}/view/${postId}`);
  };

  return (
    <div className={`text-item ${hoveringPost ? "no-hover" : "hover"}`} onClick={handleItemClick}>
      <div className="text-info">
        <div className="text-title">{boardData.displayName}</div>
        <div className="text-description">{boardData.description}</div>
        <div className="text-posts">
          {boardData.recentPosts.map((post) => (
            <div
              key={post.id}
              className="text-post-line"
              onMouseEnter={() => setHoveringPost(true)}
              onMouseLeave={() => setHoveringPost(false)}
              onClick={(e) => handlePostClick(e, post.id)}
            >
              <Link href={`/text/${boardKey}/${post.id}`}>{post.title}</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TextList({ boards }) {
  const [searchResult, setSearchResult] = useState(boards);

  return (
    <div id="booklist-content-container">
      <TextSearchConsole boards={boards} setSearchResult={setSearchResult} />
      <TextListDisplay searchResult={searchResult} />
    </div>
  );
}