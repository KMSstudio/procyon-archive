"use client";

import { useState } from "react";
import "@/app/styles/components/list/booklist.css";

export default function BookList({ books, coreTags }) {
  const [search, setSearch] = useState("");
  const [regexSearch, setRegexSearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = [...new Set(books.flatMap((book) => book.tags))];

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setRegexSearch(e.target.value ? `.*${e.target.value}.*` : "");
    setAuthorSearch("");
  };

  const handleRegexChange = (e) => {
    setRegexSearch(e.target.value);
    setSearch("");
    setAuthorSearch("");
  };

  const handleAuthorChange = (e) => {
    setAuthorSearch(e.target.value);
    setSearch("");
    setRegexSearch("");
  };

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  function BookSearchConsole() {
    return (
      <div className="search-section">
        <div className="left-search">
          <input
            type="text"
            placeholder="일반검색"
            value={search}
            onChange={handleSearchChange}
            disabled={authorSearch}
          />
          <input
            type="text"
            placeholder="정규식검색"
            value={regexSearch}
            onChange={handleRegexChange}
            disabled={authorSearch}
          />
          <input
            type="text"
            placeholder="저자검색"
            value={authorSearch}
            onChange={handleAuthorChange}
            disabled={search || regexSearch}
          />
        </div>
        <div className="right-search">
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

  function BookComponent({ book }) {
    return (
      <div className="book-item">
        <div className="book-cover">
          <a href={book.content} target="_blank">
            <img src={book.cover} alt="Book Cover" className="cover-image" />
          </a>
        </div>
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">{book.author}</p>
          <div className="book-tags">
            {book.mainTags.map((tag) => {
              const tagData = coreTags.find((t) => t.name === tag);
              return tagData ? (
                <span
                  key={tag}
                  className="main-tag"
                  style={{ backgroundColor: tagData.bgColor, color: tagData.textColor }}
                >
                  <img src={tagData.icon} alt={tag} className="tag-icon" />
                  {tag}
                </span>
              ) : null;
            })}
            {book.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
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
        try { titleMatch = new RegExp(regexSearch, "i").test(book.title); }
        catch { titleMatch = false; }
      }
      const authorMatch = authorSearch ? book.author.toLowerCase().includes(authorSearch.toLowerCase()) : true;
      const tagMatch = selectedTags.length === 0 || selectedTags.some((tag) => book.tags.includes(tag) || book.mainTags.includes(tag));
      return titleMatch && authorMatch && tagMatch;
    });

    return (
      <div className="book-list">
        {filteredBooks.map((book) => (
          <BookComponent key={book.id} book={book} />
        ))}
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <BookSearchConsole />
      <BookListDisplay />
    </div>
  );
}