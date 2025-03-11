/*
* @/app/admin/page.js
*/

// Styles (CSS)
import "@/app/styles/admin.css";
// Components
import NavBar from "@/app/components/NavBar";
import UserSection from "@/app/components/unique/AdminUserSection";
import BookSection from "@/app/components/unique/AdminBookSection";
// Next Auth
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Redirect
import { redirect } from "next/navigation";
// Constants
import navData from "@/config/navConstant.json";
import { getUserInfo } from "@/utils/auth";
import { fetchAllUser } from "@/utils/userDB";
import { getDriveFiles } from "@/utils/drive/show";

export default async function AdminPage() {
  // Load Static data
  const session = await getServerSession(authOptions);
  const userData = await getUserInfo(session);
  
  if (!userData?.is_user_admin) { redirect("/"); }
  const users = await fetchAllUser();
  const files = await getDriveFiles("book/stage");

  return (
    <div className="admin-container">
      <NavBar navs={navData.navs}/>
      <main className="admin-main">
        <div className="admin-sections">
          <UserSection users={users} />
          <BookSection files={files} />
        </div>
      </main>
    </div>
  );
}