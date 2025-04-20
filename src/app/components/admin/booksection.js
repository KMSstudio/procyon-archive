"use client";

/*
 * @/app/components/unique/BookSection.js
*/

import { useState } from "react";
// Style (CSS)
import "@/styles/components/admin/booksection.css";
import "@/styles/components/console/bookregister.css";
// Constants
import coreTags from "@/config/view/coreTag.json";

/**
 * Book Register Console
 */
function BookRegisterConsole({ cover, content }) {
  const [title, setTitle] = useState("");
  const [edition, setEdition] = useState("");
  const [author, setAuthor] = useState("");
  const [mainTags, setMainTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMainTag = () => {
    if (!selectedTag) return;
    const tagData = coreTags.find(tag => tag.name === selectedTag);
    if (!tagData || mainTags.some(tag => tag.name === selectedTag)) return;
    setMainTags([...mainTags, tagData]);
    setSelectedTag("");
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags([...tags, ...tagInput.split(" ").filter(tag => tag.trim() !== "")]);
    setTagInput("");
  };

  const removeMainTag = (tagName) => setMainTags(mainTags.filter(tag => tag.name !== tagName));
  const removeTag = (tagName) => setTags(tags.filter(tag => tag !== tagName));

  function TagPreview() {
    return (
      <div className="tag-preview">
        {mainTags.map((tag, index) => (
          <span key={index} className="main-tag" onClick={() => removeMainTag(tag.name)}
            style={{ backgroundColor: tag.bgColor, color: tag.textColor }}>
            <img src={tag.icon} alt={tag.name} className="tag-icon" />
            {tag.name}
          </span>
        ))}
        {tags.map((tag, index) => (
          <span key={index} className="tag" onClick={() => removeTag(tag)}> {tag} </span>
        ))}
      </div>
    );
  }

  const handleRegister = async () => {
    const data = { title, edition, author,
      mainTags: mainTags.map(tag => tag.name), tags,
      cover, content 
    };
    setIsSubmitting(true);
  
    try {
      const response = await fetch("/api/book/regist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Registration Failed");
    } catch (error) {
      console.error("Error while registering book:", error);
      alert("Error while registering book");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book-register">
      <div className="input-group">
        <div className="title-edition-group">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="Edition" value={edition} onChange={(e) => setEdition(e.target.value)} />
        </div>
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>

      <TagPreview />

      <div className="tag-input-group">
        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">Select Core Tag</option>
          {coreTags.map((tag) => (
            <option key={tag.name} value={tag.name}>{tag.name}</option>
          ))}
        </select>
        <button onClick={addMainTag}>+</button>
      </div>

      <div className="tag-input-group">
        <input type="text" placeholder="Tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
        <button onClick={addTag}>+</button>
      </div>

      <button className="register-button" onClick={handleRegister} disabled={isSubmitting}>
        {isSubmitting ? "submitting..." : "submit"}
      </button>
    </section>
  );
}

/**
 * Admin Book Section (Main Component)
 */
export default function AdminBookSection({ files }) {
  const [cover, setCover] = useState(null);
  const [content, setContent] = useState(null);

  function FileList() {
    return (
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
    );
  }

  return (
    <section id="book-section">
      <h2>Book Upload Stage</h2>

      {files.length > 0 ? (
        <>
          <div className="book-list-header">
            <img src="/image/ico/admin-book-section/png.png" alt="Cover Icon" className="header-icon" />
            <img src="/image/ico/admin-book-section/pdf.png" alt="Content Icon" className="header-icon" />
          </div>

          <FileList />
          { (cover && content)
            && <BookRegisterConsole cover={cover} content={content} />}
        </>
      ) : (
        <>
          <div className="book-list">
            <div className="book-item">
              <img src="/image/ico/admin-book-section/x-sign.png" alt="No Files Icon" className="book-icon" />
              <p className="book-name">No files found in /book/stage</p>
            </div>
          </div>
          <div className="empty-message">
            Go to <a href="https://drive.google.com/drive/u/0/folders/1t9IyO_pBKO6mYRSdaUEreVGRNYy45Fm5" target="_blank" rel="noopener noreferrer">Google Drive</a> to add files.
          </div>
        </>
      )}
    </section>
  );
}