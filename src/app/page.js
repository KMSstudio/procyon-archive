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
import { getRecentDBTexts } from "@/utils/database/textDB";
import { getUserv2 } from "@/utils/auth";
// Loggers
import logger from "@/utils/logger";
import TrackClient from "@/app/components/MixPanel";
// Next
import Link from 'next/link'

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
  const post = (await getRecentDBTexts('notice', 1, 1))[0];
  
  return (
    <div className="main-container">
      <NavBar navs={navs} />
      <div className="content-container">
        <Sidebar isAdmin={userData.admin} links={links} />
        <main id="main-content">
          <TrackClient user={{
              email: userData.email,
              admin: userData.admin
          }} eventName="Home Page Viewed" />
          <div className="main-content-title">
            {/* Procyon!! Procyon!! Procyon!! */}
            <h1>CSE: Archive</h1>
            <div className="main-content-title__under-title">
              <p className="main-content-title__description">Seoul National University - Computer Science and Engineering Archive</p>
              {/* <Link href={`/text/notice/view/${post.id}`} className="main-content-title__recent-post">{post.title}</Link> */}
            </div>
          </div>
          <div className="buttons">
            {buttons.map((button, index) => (
              <form key={index} action={button.href} method="get">
                <button type="submit">{button.name}</button>
              </form>
            ))}
          </div>
          <Link href={`/text/notice/view/${post.id}`} className="main-content__recent-post">{post.title}</Link>
        </main>
      </div>
    </div>
  );
}
