"use client";

import { useState, useMemo } from "react";
import BookComponent from "@/app/components/BookComponent";
import "@/app/styles/components/list/booklist.css";

export default function BookList({ books, coreTags }) {
  const [searchInput, setSearchInput] = useState("");
  const [regexInput, setRegexInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");

  const [selectedTags, setSelectedTags] = useState([]);

  const allTags = useMemo(() => [...new Set(books.flatMap((book) => book.tags))], [books]);

  const handleSearchBlur = (e, type) => {
    const value = e.target.value;

    if (type === "search") {
      setSearchInput(value);
      setRegexInput(value ? `.*${value}.*` : "");
      setAuthorInput("");
    } else if (type === "regex") {
      setRegexInput(value);
      setSearchInput("");
      setAuthorInput("");
    } else if (type === "author") {
      setAuthorInput(value);
      setSearchInput("");
      setRegexInput("");
    }
  };

  const handleSearchFocus = () => {
    setSearchInput("");
    setRegexInput("");
    setAuthorInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

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
            type="text"
            placeholder="Search"
            defaultValue={searchInput}
            onFocus={handleSearchFocus}
            onBlur={(e) => handleSearchBlur(e, "search")}
            onKeyDown={handleKeyDown}
            readOnly={authorInput !== ""}
            className={authorInput ? "disabled-input" : ""}
          />
          <input
            type="text"
            placeholder="Regex Search"
            defaultValue={regexInput}
            onFocus={handleSearchFocus}
            onBlur={(e) => handleSearchBlur(e, "regex")}
            onKeyDown={handleKeyDown}
            readOnly={authorInput !== ""}
            className={authorInput ? "disabled-input" : ""}
          />
          <input
            type="text"
            placeholder="Author Search"
            defaultValue={authorInput}
            onFocus={handleSearchFocus}
            onBlur={(e) => handleSearchBlur(e, "author")}
            onKeyDown={handleKeyDown}
            readOnly={searchInput !== "" || regexInput !== ""}
            className={searchInput || regexInput ? "disabled-input" : ""}
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
      if (regexInput) {
        try { 
          titleMatch = new RegExp(regexInput, "i").test(book.title); 
        } catch (error) {
          titleMatch = book.title.toLowerCase().includes(searchInput.toLowerCase());
        }
      }
      const authorMatch = authorInput ? book.author.toLowerCase().includes(authorInput.toLowerCase()) : true;
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