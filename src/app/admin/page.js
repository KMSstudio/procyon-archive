/*
* @/app/admin/page.js
*/

// Styles (CSS)
import "@/app/styles/admin.css";
// Components
import NavBar from "@/app/components/NavBar";
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
          <section id="user-section">
            <h2>User List</h2>
            <div className="user-list">
              {users.map((user) => (
                <div key={user.email} className="user-item">
                  <img 
                    src={user.isAdmin ? "/image/ico/user-list/admin.png" : "/image/ico/user-list/user.png"} 
                    alt="User Icon" 
                    className="user-icon"
                  />
                  <div className="user-info">
                    <p className="user-email">{user.email}</p>
                    <p className="user-last-access">{user.lastAccessDate}</p>
                  </div>
                </div>
              ))}
            </div>
            <input type="text" placeholder="Search..." className="user-search" />
          </section>
      
          <section className="book-section">
            <h2>Book Registration</h2>
            <p>The book registration feature has not been implemented yet.</p>
          </section>
        </div>
      </main>
    </div>
  );
}