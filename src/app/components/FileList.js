/*
 * @/app/components/FileList.js
*/

"use client";
// Style (CSS)
import "@/app/styles/components/list/filelist.css";
// Use State for Download Status Management
import { useState } from "react";

// Main component managing the file list
export default function FileList({ files }) {
  // File download state
  const [downloadingFiles, setDownloadingFiles] = useState({});
  // Folder interaction state
  const [interactingFolders, setInteractingFolders] = useState({});

  // File download handler
  const handleDownload = async (file, event) => {
    event.preventDefault();
    setDownloadingFiles((prev) => ({ ...prev, [file.id]: true }));

    try {
      const response = await fetch(file.downloadLink);
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
          <a 
            href={file.downloadLink} 
            onClick={(e) => handleFolderClick(file, e)} 
            className="folder-link"
            style={{ display: "flex", alignItems: "center" }}
          >
            {interactingFolders[file.id] ? (
              <img src="/image/filelist/interacting.png" alt="Interacting..." className="loading-icon" />
            ) : (
              file.name
            )}
          </a>
        ) : (
          <a 
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
    <div className="file-list">
      {files.length > 0
        ? files.map((file) => <FileComponent key={file.id} file={file} />)
        : <div className="empty-message">No files or folders found.</div>}
    </div>
  );
}