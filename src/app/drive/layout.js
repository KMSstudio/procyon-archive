/* @/app/drive/layout.js */

// Header infomation for User-agent
import { headers } from "next/headers";
// Components
import NavBar from "@/app/components/NavBar";
import NoLoginComponent from "@/app/drive/no-login";
// Constants
import navData from "@/config/navConstant.json";
import { getUser } from "@/utils/auth";
import { updateUserAccess } from "@/utils/database/userDB"
// Style (CSS)
import "@/styles/drive.css";

const allowedBots = [ "Googlebot", "Bingbot", "DuckDuckBot", "Yeti", "Daumoa", "Applebot" ];

export default async function DriveLayout({ children }) {
  const userData = await getUser();

  const ua = headers().get("user-agent") || "";
  const isAllowedBot = allowedBots.some(bot => ua.includes(bot));
  const content = (userData.do_user_login || isAllowedBot) ? children : <NoLoginComponent />;
  // updateUserAccess(userData.user_email, userData.user_info);

  return (
    <div className="main-container">
      <NavBar navs={navData.navs} />
      <div className="content-container">{content}</div>
    </div>
  );
}