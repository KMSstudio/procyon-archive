/* @/app/drive/book/EOBookList.js */

"use client";

export default function EndOfBookList() {
  return (
    <div id="end-of-booklist">
      <a
        className="end-indicator"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        This is end of the Book List
      </a>
    </div>
  );
}