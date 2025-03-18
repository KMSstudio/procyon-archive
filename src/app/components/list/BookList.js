"use client";

import { useState, useRef, useMemo } from "react";
import BookComponent from "@/app/components/BookComponent";
import "@/app/styles/components/list/booklist.css";

export default function BookList({ books, coreTags }) {
  const [search, setSearch] = useState("");
  const [regexSearch, setRegexSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const searchRef = useRef(null);
  const regexRef = useRef(null);
  const authorRef = useRef(null);

  // 태그 리스트를 useMemo로 캐싱하여 불필요한 렌더링 방지
  const allTags = useMemo(() => [...new Set(books.flatMap((book) => book.tags))], [books]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setRegexSearch(e.target.value ? `.*${e.target.value}.*` : "");
    setAuthorSearch("");
    setTimeout(() => searchRef.current?.focus(), 0);
  };

  const handleRegexChange = (e) => {
    setRegexSearch(e.target.value);
    setSearch("");
    setAuthorSearch("");
    setTimeout(() => regexRef.current?.focus(), 0);
  };

  const handleAuthorChange = (e) => {
    setAuthorSearch(e.target.value);
    setSearch("");
    setRegexSearch("");
    setTimeout(() => authorRef.current?.focus(), 0);
  };

  // ✅ selectedTags 유지 (불필요한 리렌더링 방지)
  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  function BookSearchConsole() {
    return (
      <div id="search-section">
        <div id="left-search">
          <input
            ref={searchRef}
            type="text"
            placeholder="일반검색"
            value={search}
            onChange={handleSearchChange}
            readOnly={authorSearch !== ""}
            className={authorSearch ? "disabled-input" : ""}
          />
          <input
            ref={regexRef}
            type="text"
            placeholder="정규식검색"
            value={regexSearch}
            onChange={handleRegexChange}
            readOnly={authorSearch !== ""}
            className={authorSearch ? "disabled-input" : ""}
          />
          <input
            ref={authorRef}
            type="text"
            placeholder="저자검색"
            value={authorSearch}
            onChange={handleAuthorChange}
            readOnly={search !== "" || regexSearch !== ""}
            className={search || regexSearch ? "disabled-input" : ""}
          />
        </div>
        <div id="right-search">
          <div className="tag-container">
            {coreTags.map((tag) => (
              <span
                key={tag.name}
                className={selectedTags.includes(tag.name) ? "main-tag selected" : "main-tag"}
                onClick={() => toggleTag(tag.name)}
                style={{ backgroundColor: tag.bgColor, color: tag.textColor }}>
                <img src={tag.icon} alt={tag.name} className="tag-icon" />
                {tag.name}
              </span>
            ))}
            {allTags.map((tag) => (
              <span 
                key={tag} 
                className={selectedTags.includes(tag) ? "tag selected" : "tag"} 
                onClick={() => toggleTag(tag)}>
                  {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function BookListDisplay() {
    const filteredBooks = books.filter((book) => {
      let titleMatch = true;
      if (regexSearch) {
        try { 
          titleMatch = new RegExp(regexSearch, "i").test(book.title); 
        } catch (error) {
          titleMatch = book.title.toLowerCase().includes(search.toLowerCase()); // ✅ 예외 처리 후 기본 검색 유지
        }
      }
      const authorMatch = authorSearch ? book.author.toLowerCase().includes(authorSearch.toLowerCase()) : true;
      const tagMatch = selectedTags.length === 0 || selectedTags.some((tag) => book.tags.includes(tag) || book.mainTags.includes(tag));
      return titleMatch && authorMatch && tagMatch;
    });

    return (
      <div className="book-list">
        {filteredBooks.map((book) => (
          <BookComponent key={book.id} book={book} coreTags={coreTags} />
        ))}
      </div>
    );
  }

  return (
    <div id="book-list-container">
      <BookSearchConsole />
      <BookListDisplay />
    </div>
  );
}