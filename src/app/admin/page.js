/*
* @/app/admin/page.js
*/

// Styles (CSS)
import "@/app/styles/admin.css";
// Components
import NavBar from "@/app/components/NavBar";
import UserSection from "@/app/components/unique/AdminUserSection";
// Next Auth
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Redirect
import { redirect } from "next/navigation";
// Constants
import navData from "@/config/navConstant.json";
import { getUserInfo } from "@/utils/auth";
import { fetchAllUser } from "@/utils/userDB";

export default async function AdminPage() {
  // Load Static data
  const session = await getServerSession(authOptions);
  const userData = await getUserInfo(session);
  
  if (!userData?.is_user_admin) { redirect("/"); }
  const users = await fetchAllUser();
  
  return (
    <div className="admin-container">
      <NavBar navs={navData.navs}/>
      <main className="admin-main">
        <div className="admin-sections">
          <UserSection users={users} />
      
          <section className="book-section">
            <h2>Book Registration</h2>
            <p>The book registration feature has not been implemented yet.</p>
          </section>
        </div>
      </main>
    </div>
  );
}