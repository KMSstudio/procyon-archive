/*
* @/app/admin/page.js
*/

// Styles (CSS)
import "@/styles/admin.css";
// Components
import NavBar from "@/app/components/NavBar";
import BookMdfSection from "@/app/components/admin/BookMdfSection";
import BookSection from "@/app/components/admin/booksection";
// Redirect
import { redirect } from "next/navigation";
// Utils
import { getUser } from "@/utils/auth";
import { getDriveFiles } from "@/utils/drive/show";
import { getAllDBBooks } from "@/utils/database/bookDB";
// Constants
import navData from "@/config/navConstant.json";
import coreTags from "@/config/coreTag.json";

export default async function AdminPage() {
  // Load Static data
  const userData = await getUser();
  
  if (!userData?.is_user_admin) { redirect("/"); }
  const files = await getDriveFiles("book/stage");
  const books = await getAllDBBooks();

  return (
    <div className="main-container">
      <NavBar navs={navData.navs}/>
      <main className="content-container">
        <div className="admin-sections">
          <BookMdfSection books={books} coreTags={coreTags} />
          <BookSection files={files} />
        </div>
      </main>
    </div>
  );
}