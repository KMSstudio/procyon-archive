/* @/app/drive/book/page.js */

// Styles (CSS)
import "@/app/styles/drive.css";
// Components
import BookList from "@/app/components/BookList";
// Utils
import { getAllBooks } from "@/utils/bookDB";
// Constants
import coreTags from "@/config/coreTag.json";
import Link from "next/link";

export default async function BookPage() {
  const books = await getAllBooks();

  return (
    <div>
      <BookList books={books} coreTags={coreTags} />

      <div className="control-links">
        <Link className="back-link" href="/">
          여기에 무언가를 써야 합니다
        </Link>
      </div>
  </div>
  );
}