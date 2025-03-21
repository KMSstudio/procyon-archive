/*
 * @/app/page.js
*/

// Styles (CSS)
import "./styles/index.css";
// Components
import NavBar from "./components/NavBar";
import Sidebar from "@/app/components/main/Sidebar";
// Next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Constants
import navData from "@/config/navConstant.json";
import { getUserInfo } from "@/utils/auth";
import { updateUserAccess } from "@/utils/userDB"

export default async function HomePage() {
  // Load Static data
  const session = await getServerSession(authOptions);
  const userData = await getUserInfo(session);
  
  const { navs = [], links = [], buttons = [] } = navData;
  const { is_user_admin: isAdmin } = userData;
  
  updateUserAccess(userData.user_email, userData.user_info);
  
  return (
    <div className="main-container">
      <NavBar navs={navs} />
      <div className="content-container">
        <Sidebar isAdmin={isAdmin} links={links} />
        <main className="main-content">
          <div className="main-content-title">
            {/* Procyon!! Procyon!! Procyon!! */}
            <h1>CSE: Archive</h1>
            <p>Seoul National University - Computer Science and Engineering Archive</p>
          </div>
          <div className="buttons">
            {buttons.map((button, index) => (
              <form key={index} action={button.href} method="get">
                <button type="submit">{button.name}</button>
              </form>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
