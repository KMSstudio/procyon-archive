"use client";

// React
import { useState } from "react";
// Components
import FileList from "@/app/components/list/FileList";
// Styles (CSS)
import "@/styles/components/console/searchconsole.css"
// Next Tags
import Link from "next/link";

/**
 * FileSearchConsole コンポーネント
 * - 左側の検索バーを提供し、タイトル検索または正規表現検索が可能
 */
function FileSearchConsole({ files, setFilteredFiles }) {
  const [searchInput, setSearchInput] = useState("");
  const [regexInput, setRegexInput] = useState("");
  const [disabledInputs, setDisabledInputs] = useState({ search: "", regex: "" });

  const handleSearchBlur = (e, type) => {
    const value = e.target.value;
    if (type === "search") {
      setRegexInput(value ? `.*${value}.*` : "");
      setDisabledInputs({ search: "", regex: "disabled-input" });
    } else if (type === "regex") setDisabledInputs({ search: "disabled-input", regex: "" });
  };

  const handleEnableInputs = () => {
    setSearchInput("");
    setRegexInput("");
    setDisabledInputs({ search: "", regex: "" });
    setFilteredFiles(files);
  };

  const handleOnChange = (e, type) => {
    const value = e.target.value;
    let query = regexInput;

    if (type === "search") {
      setSearchInput(value);
      query = value ? `.*${value}.*` : "";
    } else if (type === "regex") {
      setRegexInput(value);
      query = value;
    }

    try { setFilteredFiles(files.filter((file) => new RegExp(query, "i").test(file.name))); } 
    catch { setFilteredFiles([]); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") e.target.blur(); };

  return (
    <div id="search-section">
      <div id="left-search">
        <input
          type="text"
          placeholder="Search Title"
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
      </div>
    </div>
  );
}

/**
 * ExamFileList コンポーネント
 * - FileSearchConsoleとFileListを組み合わせた検索付きリスト表示
 */
export default function ExamFileList({ files }) {
  const [filteredFiles, setFilteredFiles] = useState(files);

  return (
    <div id="exam-filelist">
      <FileSearchConsole files={files} setFilteredFiles={setFilteredFiles} />
      <div className="container">
        <FileList files={filteredFiles} />
        <div id="filelist-control-links">
          <Link className="back-link" href="/">Home</Link>
        </div>
      </div>
    </div>
  );
}