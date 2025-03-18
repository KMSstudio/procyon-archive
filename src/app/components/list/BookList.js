"use client";

import { useState, useMemo } from "react";
import BookComponent from "@/app/components/BookComponent";
import "@/app/styles/components/list/booklist.css";

// 検索UIとロジックを担当するコンポーネント
function BookSearchConsole({ books, coreTags, setSearchResult }) {
  // 検索入力の状態（UI用）
  const [searchInput, setSearchInput] = useState("");
  const [regexInput, setRegexInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");

  // 検索方法の選択状態（特定の検索モードが有効）
  const [disabledInputs, setDisabledInputs] = useState({
    search: "",
    regex: "",
    author: "",
  });

  // 選択されたタグの状態
  const [selectedTags, setSelectedTags] = useState([]);
  const allTags = useMemo(() => [...new Set(books.flatMap((book) => book.tags))], [books]);

  // 検索実行関数（検索条件を直接受け取る）
  const executeSearch = (regexQuery, authorQuery) => {
    const filteredBooks = books.filter((book) => {
      let titleMatch = true;
      if (regexQuery) {
        try { titleMatch = new RegExp(regexQuery, "i").test(book.title); }
        catch (error) { titleMatch = false; }
      }
      const authorMatch = authorQuery ? book.author.toLowerCase().includes(authorQuery.toLowerCase()) : true;
      const tagMatch = selectedTags.length === 0 || selectedTags.some((tag) => book.tags.includes(tag) || book.mainTags.includes(tag));

      return titleMatch && authorMatch && tagMatch;
    });
    setSearchResult(filteredBooks);
  };

  // 入力フィールドのフォーカスが外れたときの処理
  const handleSearchBlur = (e, type) => {
    if (type === "search") {
      const value = e.target.value;
      setRegexInput(value ? `.*${value}.*` : "");
      setDisabledInputs({ search: "", regex: "", author: "disabled-input" });
    }
    else if (type === "regex") { setDisabledInputs({ search: "disabled-input", regex: "", author: "disabled-input" }); }
    else if (type === "author") { setDisabledInputs({ search: "disabled-input", regex: "disabled-input", author: "" }); }
  };

  // キー入力イベントの処理
  const handleOnChange = (e, type) => {
    const value = e.target.value;
    let regexQuery = "";
    let authorQuery = "";

    if (type === "search") { setSearchInput(value); regexQuery = value ? `.*${value}.*` : ""; }
    else if (type === "regex") { setRegexInput(value); regexQuery = value; }
    else if (type === "author") { setAuthorInput(value); authorQuery = value; }

    executeSearch(regexQuery, authorQuery);
  };
  const handleKeyDown = (e) => { if(e.key === "Enter") {e.target.blur(); } }

  // 入力フィールドをリセットし、すべての検索モードを有効にする
  const handleEnableInputs = () => {
    setSearchInput("");
    setRegexInput("");
    setAuthorInput("");
    setDisabledInputs({ search: "", regex: "", author: "" });
    executeSearch("", "");
  };

  return (
    <div id="search-section">
      <div id="left-search">
        <input
          type="text"
          placeholder="Search"
          value={searchInput}
          onBlur={(e) => handleSearchBlur(e, "search")}
          onChange={(e) => handleOnChange(e, "search")}
          onClick={handleEnableInputs}
          onKeyDown={handleKeyDown}
          className={disabledInputs.search}
        />
        <input
          type="text"
          placeholder="Regex Search"
          value={regexInput}
          onBlur={(e) => handleSearchBlur(e, "regex")}
          onChange={(e) => handleOnChange(e, "regex")}
          onClick={handleEnableInputs}
          onKeyDown={handleKeyDown}
          className={disabledInputs.regex}
        />
        <input
          type="text"
          placeholder="Author Search"
          value={authorInput}
          onBlur={(e) => handleSearchBlur(e, "author")}
          onChange={(e) => handleOnChange(e, "author")}
          onClick={handleEnableInputs}
          onKeyDown={handleKeyDown}
          className={disabledInputs.author}
        />
      </div>
      <div id="right-search">
        <div className="tag-container">
          {coreTags.map((tag) => (
            <span
              key={tag.name}
              className={selectedTags.includes(tag.name) ? "main-tag selected" : "main-tag"}
              onClick={() => setSelectedTags((prev) => (prev.includes(tag.name) ? prev.filter((t) => t !== tag.name) : [...prev, tag.name]))}
              style={{ backgroundColor: tag.bgColor, color: tag.textColor }}>
              <img src={tag.icon} alt={tag.name} className="tag-icon" />
              {tag.name}
            </span>
          ))}
          {allTags.map((tag) => (
            <span key={tag} className={selectedTags.includes(tag) ? "tag selected" : "tag"} onClick={() => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 検索結果を表示するコンポーネント
function BookListDisplay({ searchResult, coreTags }) {
  return (
    <div className="book-list">
      {searchResult.map((book) => (
        <BookComponent key={book.id} book={book} coreTags={coreTags} />
      ))}
    </div>
  );
}

// 状態を管理する親コンポーネント
export default function BookList({ books, coreTags }) {
  const [searchResult, setSearchResult] = useState(books);

  return (
    <div id="book-list-container">
      <BookSearchConsole
        books={books}
        coreTags={coreTags}
        setSearchResult={setSearchResult}
      />
      <BookListDisplay searchResult={searchResult} coreTags={coreTags} />
    </div>
  );
}