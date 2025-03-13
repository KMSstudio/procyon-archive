/*
 *  @/app/drive/book/page.js
 */


// Styles (CSS)
import "@/app/styles/drive.css";
// Components
import NavBar from "@/app/components/NavBar";
import BookList from "@/app/components/BookList";
// Utils
import { getAllBooks } from "@/utils/bookDB";
// Constants
import coreTags from "@/config/coreTag.json";

export default async function BookPage() {
  const books = await getAllBooks();

  return (
    <div className="main-container">
      <NavBar />
      <main className="book-content">
        <BookList books={books} coreTags={coreTags} />
      </main>
    </div>
  );
}