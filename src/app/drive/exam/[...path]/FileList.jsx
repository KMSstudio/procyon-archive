/*
 * @/app/drive/exam/[...path]/FileList.jsx
*/

"use client";
// Component
import JeboFileComponent from "./JeboFileComponent";
// Style (CSS)
import "@/styles/components/list/filelist.css";
// Use State for Download Status Management
import { useState } from "react";

// Main component managing the file list
export default function FileList({ files, folder }) {
  // File download state
  const [downloadingFiles, setDownloadingFiles] = useState({});
  // Folder interaction state
  const [interactingFolders, setInteractingFolders] = useState({});

  console.log(folder);
  // File download handler
  const handleDownload = async (file, event) => {
    event.preventDefault();
    setDownloadingFiles((prev) => ({ ...prev, [file.id]: true }));

    try {
      const response = await fetch(`${file.downloadLink}?name=${file.name}`);
      if (!response.ok) throw new Error(`Fail to download file: ${file.name}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Trigger file download via <a> tag
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Fail to download file: ${file.name}`, error);
    } finally {
      setDownloadingFiles((prev) => ({ ...prev, [file.id]: false }));
    }
  };

  // Folder interaction handler
  const handleFolderClick = (file, event) => {
    event.preventDefault();
    setInteractingFolders((prev) => ({ ...prev, [file.id]: true }));
    window.location.href = file.downloadLink;
  };

  // Internal component to render individual file items
  function FileComponent({ file }) {
    return (
      <div key={file.id} className="file-item" data-file-name={file.name} data-file-ext={file.ext}>
        <img src={file.img} alt="File Icon" className="file-icon" />
        {file.isFolder ? (
          <a className="file-item__title folder-link"
            href={file.downloadLink} 
            onClick={(e) => handleFolderClick(file, e)} 
            style={{ display: "flex", alignItems: "center" }}
          >
            {interactingFolders[file.id] ? (
              <img src="/image/filelist/interacting.png" alt="Interacting..." className="loading-icon" />
            ) : (
              file.name
            )}
          </a>
        ) : (
          <a className="file-item__title"
            href={file.downloadLink} 
            onClick={(e) => handleDownload(file, e)}
            style={{ pointerEvents: downloadingFiles[file.id] ? "none" : "auto", display: "flex", alignItems: "center" }}
          >
            {downloadingFiles[file.id] ? (
              <img src="/image/filelist/downloading.png" alt="Downloading..." className="loading-icon" />
            ) : (
              file.name
            )}
          </a>
        )}
      </div>
    );
  }

  return (
    <div id="file-list">
      {files.length > 0
        ? files.map((file) => <FileComponent key={file.id} file={file} />)
        : <div className="empty-message">No files or folders found.</div>}
      
      {/* Jebo Link */}
      {files.length > 0 && <JeboFileComponent folder={folder} />}
    </div>
  );
}