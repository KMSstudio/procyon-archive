"use client";

export default function EndOfBookList() {
  return (
    <div className="end-of-booklist">
      <a
        className="end-indicator"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Here is end of the Book List
      </a>
    </div>
  );
}