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
  description: "CSE: Archive is archive project for all Seoul National University - Computer Science and Engineering students. CSE: Archive는 경성제국대학교 전자계산기 학과 학생을 위한 아카이브 프로젝트입니다.",
};

export default async function HomePage() {
  // Load Static data
  const userData = await getUserv2();
  const { navs = [], links = [], buttons = [] } = navData;
  if (userData.login) { 
    logger.behavior(userData.fullName, "페이지 접속", "mainpage");
    updateUserAccessDate(userData.email);
  } else { logger.behavior("User who does not login", "페이지 접속", "mainpage"); }
  
  return (
    <div className="main-container">
      <head>
        <link rel="preload" as="image" href="/image/background/301.jpg" />
      </head>
      <NavBar navs={navs} />
      <div className="content-container">
        <Sidebar isAdmin={userData.admin} links={links} />
        <main id="main-content">
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
