"use client";

// React
import { useState } from "react";
// Styles (CSS)
import "@/styles/components/console/searchconsole.css"
import "@/styles/components/list/filelist.css";
// Next Tags
import Link from "next/link";

/**
 * FileSearchConsole コンポーネント
 * - 左側の検索バーを提供し、タイトル検索または正規表現検索が可能
 */
function FileSearchConsole({ files, setFilteredFiles, setIsFilteringOn }) {
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
    setIsFilteringOn(false);
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
    
    const isFiltering = !!value;
    setIsFilteringOn(isFiltering);

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
 * ExamFileListDisplay コンポーネント
 *
 * FileListとの主な違い:
 * - フォルダのみを表示する点（isFolder が false のファイルは無視される）
 * - ファイルのダウンロード機能は一切含まれていない（表示・クリックはフォルダ遷移のみ）
 * - imgIcoSrc パラメータを通じて、全フォルダに共通のロゴ画像を表示可能（省略時は file.img を使用）
 *
 * 注意:
 * - 通常の FileList ではフォルダ・ファイルの両方を表示・操作可能だが、本コンポーネントはフォルダ専用
 * - ファイルタイプ（PDF, ZIP など）はこのコンポーネントで一切レンダリングされない
 */
function ExamFileListDisplay({ files, imgIcoSrc }) {
  const folders = files.filter((file) => file.isFolder);
  const [interactingFolders, setInteractingFolders] = useState({});

  const handleFolderClick = (file, event) => {
    event.preventDefault();
    setInteractingFolders((prev) => ({ ...prev, [file.id]: true }));
    window.location.href = file.downloadLink;
  };

  function FileComponent({ file }) {
    return (
      <div key={file.id} className="file-item" data-file-name={file.name} data-file-ext={file.ext}>
        <img src={imgIcoSrc || file.img} alt="Folder Icon" className="file-icon" />
        <a href={file.downloadLink} onClick={(e) => handleFolderClick(file, e)} className="folder-link" style={{ display: "flex", alignItems: "center" }} >
          {interactingFolders[file.id] ? 
            (<img src="/image/filelist/interacting.png" alt="Interacting..." className="loading-icon" />) :
            (file.name)}
        </a>
      </div>
    );
  }

  return (
    <div id="file-list">
      {folders.length > 0
        ? folders.map((file) => <FileComponent key={file.id} file={file} />)
        : <div className="empty-message">No folders found.</div>}
    </div>
  );
}

/**
 * ExamFileList コンポーネント
 * - FileSearchConsoleとFileListを組み合わせた検索付きリスト表示
 */
export default function ExamFileList({ files, hotFiles }) {
  const [filteredFiles, setFilteredFiles] = useState(files);
  const [isFilteringOn, setIsFilteringOn] = useState(false);
  
  const hotFilesArr = Array.isArray(hotFiles) ? hotFiles : [];
  const hotFileObjects = files
    .filter((file) => hotFilesArr.includes(file.name))
    .map((file) => ({
      ...file,
      imgIcoSrc: "/image/filelist/hotexam.png",
    }));

  return (
    <div id="exam-filelist">
      <FileSearchConsole
        files={files}
        setFilteredFiles={setFilteredFiles}
        setIsFilteringOn={setIsFilteringOn}
      />
      <div className="container">
        {/* Hot File List Display */}
        {(!isFilteringOn && hotFileObjects.length > 0) && (<>
          <div className="filelist-content-title"><h1>Popular</h1></div>
          <ExamFileListDisplay files={hotFileObjects} imgIcoSrc={`/image/filelist/hotexam.png`} />
        </>)}
        {/* Normal File List Display */}
        <div className="filelist-content-title"><h1>Contents of Reference</h1></div>
        <ExamFileListDisplay files={filteredFiles} />
        <div id="filelist-control-links">
          <Link className="back-link" href="/">Home</Link>
        </div>
      </div>
    </div>
  );
}