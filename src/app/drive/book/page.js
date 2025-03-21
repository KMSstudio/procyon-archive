/* @/app/drive/book/page.js */

// Styles (CSS)
import "@/app/styles/drive.css";
// Next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Components
import BookList from "@/app/components/list/BookList";
import EOBookList from "./EOBookList";
// Utils
import { getUserInfo } from "@/utils/auth";
import { getAllDBBooks } from "@/utils/database/bookDB";
// Constants
import coreTags from "@/config/coreTag.json";

export default async function BookPage() {
  const session = await getServerSession(authOptions);
  const userData = await getUserInfo(session);

  const books = await getAllDBBooks();
  const visibBooks = userData.is_user_admin 
  ? books 
  : books.filter((book) => !book.tags.includes("hidden"));

  return (
    <div>
      <BookList books={visibBooks} coreTags={coreTags} />
      <EOBookList />
    </div>
  );
}