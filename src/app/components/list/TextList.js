"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/components/list/booklist.css";
import "@/styles/components/bookcomponent.css";

function TextSearchConsole({ boards, setSearchResult }) {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchInput(keyword);

    const filteredBoards = {};
    Object.entries(boards).forEach(([key, value]) => {
      filteredBoards[key] = {
        ...value,
        recentPosts: value.recentPosts.filter((post) =>
          post.title.toLowerCase().includes(keyword)
        ),
      };
    });

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
    <div id="booklist">
      {Object.entries(searchResult).map(([boardKey, boardData]) => (
        <div key={boardKey} className="book-item">
          <div className="book-info">
            <div className="book-title">{boardData.displayName}</div>
            <div className="book-tags">
              {boardData.recentPosts.map((post) => (
                <div key={post.id} className="tag">
                  <Link href={`/text/${boardKey}/${post.id}`}>
                    {post.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
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