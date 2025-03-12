"use client";

/*
 * @/app/components/unique/AdminBookSection.js
*/

import { useState } from "react";
import BookRegisterConsole from "@/app/components/unique/BookRegisterConsole"; 
import "@/app/styles/components/unique/AdminBookSection.css";

export default function BookSection({ files }) {
  const [cover, setCover] = useState(null);
  const [content, setContent] = useState(null);

  return (
    <section id="book-section">
      <h2>Book Upload Stage</h2>

      <div className="book-list-header">
        <img src="/image/ico/admin-book-section/png.png" alt="Cover Icon" className="header-icon" />
        <img src="/image/ico/admin-book-section/pdf.png" alt="Content Icon" className="header-icon" />
      </div>

      {/* File List */}
      <div className="book-list">
        {files.map((file) => (
          <div key={file.id} className="book-item">
            <img src={file.img} alt="File Icon" className="book-icon"/>
            <p className="book-name">{file.name}</p>

            <input
              type="radio"
              name="cover"
              checked={cover === file.name}
              onChange={() => setCover(file.name)}
            />
            <input
              type="radio"
              name="content"
              checked={content === file.name}
              onChange={() => setContent(file.name)}
            />
          </div>
        ))}
      </div>

      {/* Register Console */}
      <BookRegisterConsole cover={cover} content={content} />
    </section>
  );
}