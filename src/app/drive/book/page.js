/* @/app/drive/book/page.js */

// Styles (CSS)
import "@/styles/drive.css";
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
      <div id="book-head-info">
        <p>CSE: Archive에 등록된 도서는 인터넷과 여러분의 제보를 통해 구해집니다. 문제될 시 tomskang@naver.com으로 문의주시면 내리겠습니다.</p>
      </div>
      <BookList books={visibBooks} coreTags={coreTags} />
      <EOBookList />
    </div>
  );
}