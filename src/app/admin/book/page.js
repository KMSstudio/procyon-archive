/*
* @/app/admin/page.js
*/

// Styles (CSS)
import "@/app/styles/admin.css";
// Components
import NavBar from "@/app/components/NavBar";
import BookMdfSection from "@/app/components/unique/BookMdfSection";
import BookSection from "@/app/components/unique/booksection";
// Next Auth
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Redirect
import { redirect } from "next/navigation";
// Utils
import { getUserInfo } from "@/utils/auth";
import { getDriveFiles } from "@/utils/drive/show";
import { getAllDBBooks } from "@/utils/bookDB";
// Constants
import navData from "@/config/navConstant.json";
import coreTags from "@/config/coreTag.json";

export default async function AdminPage() {
  // Load Static data
  const session = await getServerSession(authOptions);
  const userData = await getUserInfo(session);
  
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