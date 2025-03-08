"use client";
import "../styles/filelist.css";

export default function FileList({ files, extLists }) {
  const updatedFiles = files.map((file) => ({
    ...file,
    img: file.isFolder
      ? "/image/ico/folder.png"
      : extLists[file.ext] || "/image/ico/file.png"
  }));

  return (
    <div className="file-list">
      {updatedFiles.length > 0 ? (
        updatedFiles.map((file) => (
          <div key={file.id} className="file-item" data-file-name={file.name} data-file-ext={file.ext}>
            <img src={file.img} alt="File Icon" className="file-icon" />
            <a href={file.downloadLink} download={!file.isFolder}>
              {file.name}
            </a>
            <img src="/image/ico/download.png" alt="Zip" class="download-zip-each-btn"></img>
          </div>
        ))
      ) : (
        <div className="empty-message">No files or folders found.</div>
      )}
    </div>
  );
}