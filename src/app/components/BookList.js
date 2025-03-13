"use client";

/*
 *  @/app/components/BookList.js
 */

import "@/app/styles/components/list/booklist.css";

/**
 * Book List (Client Component)
 */
export default function BookList({ books, coreTags }) {
  return (
    <div className="book-list">
      {books.map((book) => (
        <div key={book.id} className="book-item">
          {/* Left: Cover Image */}
          <div className="book-cover">
            <a href={book.content} target="_blank">
              <img
                src={book.cover}
                alt="Book Cover"
                className="cover-image"
              />
            </a>
          </div>

          {/* Right: Book Details */}
          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">{book.author}</p>

            {/* Tags */}
            <div className="book-tags">
              {book.mainTags.map((tag) => {
                const tagData = coreTags.find(t => t.name === tag);
                return tagData ? (
                  <span
                    key={tag}
                    className="main-tag"
                    style={{ backgroundColor: tagData.bgColor, color: tagData.textColor }}
                  >
                    <img src={tagData.icon} alt={tag} className="tag-icon" />
                    {tag}
                  </span>
                ) : null;
              })}
              {book.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}