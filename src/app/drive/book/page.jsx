/* @/app/drive/book/page.js */

// Styles (CSS)
import "@/styles/drive.css";
// Components
import BookList from "@/app/components/list/BookList";
import EOBookList from "./EOBookList";
// Utils
import { getUserv2 } from "@/utils/auth";
import { getAllDBBooks } from "@/utils/database/bookDB";
// Constants
import coreTags from "@/config/view/coreTag.json";
// Logger
import logger from "@/utils/logger";
import TrackClient from "@/app/components/MixPanel";

export default async function BookPage() {
  const userData = await getUserv2();
  const books = await getAllDBBooks();

  const getFlag = (book, key) => Boolean(book[key]);
  const visibBooks = books.filter((book) => {
    if (userData?.admin) {
      return true;
    } else if (userData?.isPrestige) {
      return (
        !book?.tags?.includes("hidden") && (
        getFlag(book, "allowPrestige") ||
        getFlag(book, "allowPublic"))
      );
    } else {
      return !book?.tags?.includes("hidden") && getFlag(book, "allowPublic");
    }
  });

  logger.behavior(userData.fullName, "도서 목록 조회");

  return (
    <div className="content-container">
      <TrackClient
        user={{ email: userData.email, admin: userData.admin }}
        eventName="Book Page Viewed"
      />  
      <div>
        <div id="book-head-info">
          <p>
            CSE: Archive에 등록된 도서는 인터넷과 여러분의 제보를 통해 구해집니다. 
            문제될 시 tomskang@naver.com으로 문의주시면 내리겠습니다.
          </p>
        </div>
        <BookList books={visibBooks} coreTags={coreTags} />
        <EOBookList />
      </div>
    </div>
  );
}
