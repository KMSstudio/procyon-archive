/* @/app/drive/book/page.js */

// Styles (CSS)
import "@/app/styles/drive.css";
// Components
import BookList from "@/app/components/BookList";
import EOBookList from "./EOBookList";
// Utils
import { getAllBooks } from "@/utils/bookDB";
// Constants
import coreTags from "@/config/coreTag.json";

export default async function BookPage() {
  const books = await getAllBooks();

  return (
    <div className="div-100vw">
      <BookList books={books} coreTags={coreTags} />
      <EOBookList />
    </div>
  );
}