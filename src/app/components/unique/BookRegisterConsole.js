"use client";

/*
 * @/app/components/unique/BookRegisterConsole.js
*/

import { useState } from "react";
import coreTags from "@/config/coreTag.json";
import "@/app/styles/components/unique/BookRegisterConsole.css";

export default function BookRegisterConsole() {
  // 書籍情報（タイトル、版数、著者）
  const [title, setTitle] = useState("");
  const [edition, setEdition] = useState("");
  const [author, setAuthor] = useState("");

  // 核心タグ（選択されたタグのリスト）
  const [mainTags, setMainTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  // 一般タグ（ユーザー入力のタグ）
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  // 核心タグを追加する
  const addMainTag = () => {
    if (!selectedTag) return;

    const tagData = coreTags.find(tag => tag.name === selectedTag);
    if (!tagData) return;
    // すでに追加されたタグを再度追加しないようにする
    if (mainTags.some(tag => tag.name === selectedTag)) return;

    setMainTags([...mainTags, tagData]);
    setSelectedTag("");
  };

  // 一般タグを追加する
  const addTag = () => {
    if (!tagInput.trim()) return;
    const newTags = tagInput.split(" ").filter(tag => tag.trim() !== "");
    setTags([...tags, ...newTags]);
    setTagInput("");
  };

  const removeMainTag = (tagName) => { setMainTags(mainTags.filter(tag => tag.name !== tagName)); };
  const removeTag = (tagName) => { setTags(tags.filter(tag => tag !== tagName)); };

  return (
    <section id="book-register">
      {/* 書籍情報の入力欄 */}
      <div className="input-group">
        <div className="title-edition-group">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="text" placeholder="Edition" value={edition} onChange={(e) => setEdition(e.target.value)} />
        </div>
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>

      {/* タグのプレビュー */}
      <div className="tag-preview">
        {mainTags.map((tag, index) => (
          <span 
            key={index} className="main-tag" onClick={() => removeMainTag(tag.name)} 
            style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
          >
            <img src={tag.icon} alt={tag.name} className="tag-icon" />
            {tag.name}
          </span>
        ))}
        {tags.map((tag, index) => (
          <span key={index} className="tag" onClick={() => removeTag(tag)}>
            <img src={"/image/ico/copy.png"} alt={tag} className="tag-icon" />
            {tag}
          </span>
        ))}
      </div>

      {/* 核心タグの選択欄 */}
      <div className="tag-input-group">
        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">Select Core Tag</option>
          {coreTags.map((tag) => (
            <option key={tag.name} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>
        <button onClick={addMainTag}>+</button>
      </div>

      {/* 一般タグの入力欄 */}
      <div className="tag-input-group">
        <input type="text" placeholder="Tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
        <button onClick={addTag}>+</button>
      </div>
    </section>
  );
}