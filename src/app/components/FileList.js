/*
 * @/app/components/FileList.js
*/

"use client";
import "@/app/styles/filelist.css";
import { useState } from "react";
import Link from "next/link";

// Main component managing the file list
export default function FileList({ files, extLists }) {
  // File download state
  const [downloadingFiles, setDownloadingFiles] = useState({});
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

  // Internal component to render individual file items
  function FileComponent({ file }) {
    return (
      <div key={file.id} className="file-item" data-file-name={file.name} data-file-ext={file.ext}>
        <img src={file.img} alt="File Icon" className="file-icon" />
        {file.isFolder
          ? (<Link href={file.downloadLink} className="folder-link">{file.name}</Link>)
          : (<a href={file.downloadLink} onClick={(e) => handleDownload(file, e)}
            style={{ pointerEvents: downloadingFiles[file.id] ? "none" : "auto", display: "flex", alignItems: "center" }}>
            {downloadingFiles[file.id]
              ? (<img src="/image/loading.png" alt="Downloading..." className="loading-icon" />)
              : (file.name)}
          </a>)}
      </div>
    );
  }

  // Process file data to add appropriate icons
  const updatedFiles = files.map((file) => ({
    ...file,
    img: file.isFolder
      ? "/image/ico/folder.png"
      : extLists[file.ext] || "/image/ico/file.png",
  }));

  return (
    <div className="file-list">
      {updatedFiles.length > 0
        ? (updatedFiles.map((file) => <FileComponent key={file.id} file={file} />))
        : (<div className="empty-message">No files or folders found.</div>)}
    </div>
  );
}