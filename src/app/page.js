/* @/app/page.js */

// Styles (CSS)
import "@/styles/index.css";
// Components
import NavBar from "./components/NavBar";
import Sidebar from "@/app/components/main/Sidebar";
// Constants
import navData from "@/config/navConstant.json";
// Utils
import { updateUserAccessDate } from "@/utils/database/userDB"
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";

export const metadata = {
  title: "CSE Archive",
  description: "CSE: Archive is archive project for all Seoul National University - Computer Science and Engineering students",
};

export default async function HomePage() {
  // Load Static data
  const userData = await getUserv2();
  const { navs = [], links = [], buttons = [] } = navData;
  if (userData.login) { 
    logger.info(`「${userData.fullName}」가 메인 페이지에 겁속했습니다.`);
    updateUserAccessDate(userData.email);
  } else { logger.info(`「User who does not login」가 메인 페이지에 겁속했습니다.`); }
  
  return (
    <div className="main-container">
      <NavBar navs={navs} />
      <div className="content-container">
        <Sidebar isAdmin={userData.admin} links={links} />
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
