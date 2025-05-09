// @/app/components/admin/JeboSection.js

"use client";

import { useState } from "react";
import "@/styles/components/admin/jebosection.css";

export default function JeboSection({ jebos }) {
  const [expanded, setExpanded] = useState(null);
  const [subfiles, setSubfiles] = useState({});

  const toggleFolder = async (folderName) => {
    if (expanded === folderName) {
      setExpanded(null);
      return;
    }

    if (!subfiles[folderName]) {
      const res = await fetch(`/api/drive/show?path=jebo/${folderName}`);
      const data = await res.json();
      setSubfiles((prev) => ({ ...prev, [folderName]: data }));
    }

    setExpanded(folderName);
  };

  return (
    <section id="jebo-section">
      <h2>Jebo List</h2>

      {jebos.length === 0 && <p>제보가 없습니다.</p>}
      {/* Jebo List */}
      <div className="jebo-list">
        {jebos.map((folder) => (
          // Each Jebo Item
          <div key={folder.name} className="jebo-item">
            <div key={`content-of-${folder.name}`} className="jebo-folder-item" onClick={() => toggleFolder(folder.name)}>
              <img src={expanded === folder.name ? "/image/ico/admin-jebo-section/open.png" : "/image/ico/admin-jebo-section/jebo.png"} alt="Folder Icon" className="folder-icon"/>
              <p className="folder-name">{folder.name}</p>
            </div>

            {expanded === folder.name && (
              <div className="expanded-jebo-list">
                {subfiles[folder.name]?.map((file) => (
                  <div key={file.name} className="jebo-file-item">
                    <img src={file.img} alt="File Icon" className="file-icon"/>
                    <p className="file-name">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}