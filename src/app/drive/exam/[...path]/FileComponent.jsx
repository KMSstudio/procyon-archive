/*
 * @/app/drive/exam/[...path]/FileComponent.jsx
*/

"use client";
import { useState } from "react";
import "@/styles/components/list/filelist.css";

export default function FileComponent({ file }) {
  const [isInteracting, setIsInteracting] = useState(false);

  // File download handler
  const handleDownload = async (event) => {
    event.preventDefault();
    setIsInteracting(true);

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
    }
    catch (error) { console.error(`Fail to download file: ${file.name}`, error); }
    finally { setIsInteracting(false); }
  };

  // Folder interaction handler
  const handleFolderClick = (event) => {
    event.preventDefault();
    setIsInteracting(true);
    window.location.href = file.downloadLink;
  };

  return (
    <div className="file-item" data-file-name={file.name} data-file-ext={file.ext}>
      <img src={file.img} alt="File Icon" className="file-icon" />
      {file.isFolder ? (
        <a className="file-item__title" href={file.downloadLink} onClick={handleFolderClick}>
          {isInteracting
            ? (<img src="/image/filelist/interacting.png" alt="Interacting..." className="loading-icon" />)
            : (file.name)}
        </a>
      ) : (
        <a className="file-item__title" href={file.downloadLink} onClick={handleDownload}>
          {isInteracting
            ? (<img src="/image/filelist/downloading.png" alt="Interacting..." className="loading-icon" />)
            : (file.name)}
        </a>
      )}
    </div>
  );
}
