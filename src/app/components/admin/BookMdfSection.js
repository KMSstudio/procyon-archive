"use client";

// React
import { useEffect, useState } from "react";
// Style (CSS)
import "@/styles/components/admin/bookmdfsection.css";
import "@/styles/components/console/bookregister.css";
// Components
import BookComponent from "@/app/components/BookComponent";
// Constants
import coreTags from "@/config/coreTag.json";

/* 
 * BookRegisterConsole Component 
 * - Provides a form for modifying and deleting book details 
 */
function BookRegisterConsole({ initialData }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [edition, setEdition] = useState(initialData?.edition || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [mainTags, setMainTags] = useState(initialData?.mainTags || []);
  const [tags, setTags] = useState(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update all states when `initialData` changes
  useEffect(() => {
    setTitle(initialData?.title || "");
    setEdition(initialData?.edition || "");
    setAuthor(initialData?.author || "");
    setTags(initialData?.tags || []);
    setSelectedTag("");

    if (initialData?.mainTags) {
      const resolvedMainTags = initialData.mainTags
        .map(mainTagName => coreTags.find(tag => tag.name === mainTagName))
        .filter(Boolean);
      setMainTags(resolvedMainTags);
    } else {
      setMainTags([]);
    }
  }, [initialData]);

  // Add main tag from predefined `coreTags`
  const addMainTag = () => {
    if (!selectedTag) return;
    const tagData = coreTags.find(tag => tag.name === selectedTag);
    if (!tagData || mainTags.some(tag => tag.name === selectedTag)) return;
    setMainTags([...mainTags, tagData]);
    setSelectedTag("");
  };

  // Add a custom tag manually
  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags([...tags, ...tagInput.split(" ").filter(tag => tag.trim() !== "")]);
    setTagInput("");
  };

  // Remove selected tags
  const removeMainTag = (tagName) => setMainTags(mainTags.filter((tag) => tag.name !== tagName));
  const removeTag = (tagName) => setTags(tags.filter((tag) => tag !== tagName));

  function TagPreview() {
    return (
      <div className="tag-preview">
        {mainTags.map((tag, index) => (
          <span
            key={index}
            className="main-tag"
            onClick={() => removeMainTag(tag.name)}
            style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
          >
            <img src={tag.icon} alt={tag.name} className="tag-icon" />
            {tag.name}
          </span>
        ))}
        {tags.map((tag, index) => (
          <span key={index} className="tag" onClick={() => removeTag(tag)}>
            {tag}
          </span>
        ))}
      </div>
    );
  }

  // Submit book modification request
  const handleSubmit = async () => {
    const updatedData = {
      title,
      edition,
      author,
      mainTags: mainTags.map(tag => tag.name),
      tags
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/book/modify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: initialData.id, data: updatedData })
      });
      if (!response.ok) throw new Error("Modification Failed");
    } catch (error) {
      console.error("Error modifying book:", error);
      alert("Error modifying book");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send book deletion request
  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to delete this book?")) return;

    setIsDeleting(true);

    try {
      const response = await fetch("/api/book/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: initialData.id }),
      });
      if (!response.ok) throw new Error("Deletion Failed");
      alert("Book deleted successfully");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error deleting book");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section id="book-register">
      <div className="input-group">
        <div className="title-edition-group">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Edition"
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
          />
        </div>
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <TagPreview />

      {/* Add main tag */}
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

      {/* Add custom tags */}
      <div className="tag-input-group">
        <input
          type="text"
          placeholder="Tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
        <button onClick={addTag}>+</button>
      </div>

      {/* Button group for modifying and deleting books */}
      <div className="button-group">
        <button className="register-button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Modifying..." : "Modify"}
        </button>
        <button className="delete-button" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </section>
  );
}

/* 
 * BookMdfSection Component 
 * - Provides a search function and book modification interface 
 */
export default function BookMdfSection({ books, coreTags }) {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [idx, setIdx] = useState(0);
  const selectedBook = searchResult.length > 0 ? searchResult[idx] : null;

  // Execute search when input changes
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setQuery(searchTerm);

    if (searchTerm.trim() === "") {
      setSearchResult([]);
      setIdx(0);
      return;
    }

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm));
    setSearchResult(filteredBooks);
    setIdx(0);
  };

  return (
    <section id="book-modify-section">
      <h2>Modify Book</h2>

      {/* Search input field */}
      <input
        type="text"
        placeholder="Enter book title..."
        value={query}
        onChange={handleSearch}
        className="book-search"
      />

      {/* Search results and navigation buttons */}
      {searchResult.length > 0 && (
        <div className="book-navigation">
          <button onClick={() => setIdx((idx - 1 + searchResult.length) % searchResult.length)}>{"<"}</button>
          <BookComponent key={selectedBook.id} book={selectedBook} coreTags={coreTags} />
          <button onClick={() => setIdx((idx + 1) % searchResult.length)}>{">"}</button>
        </div>
      )}

      {/* Modify selected book details */}
      {selectedBook && (
        <BookRegisterConsole 
          cover={selectedBook.cover} 
          content={selectedBook.content}
          initialData={selectedBook}
        />
      )}
    </section>
  );
}
