/* @/app/drive/layout.js */

// Header infomation for User-agent
import { headers } from "next/headers";
// Components
import NavBar from "@/app/components/NavBar";
import NoLoginComponent from "@/app/drive/no-login";
// Constants
import navData from "@/config/navConstant.json";
import { getUserv2 } from "@/utils/auth";
import { updateUserAccessDate } from "@/utils/database/userDB"
// Style (CSS)
import "@/styles/drive.css";

const allowedBots = [ "Googlebot", "Bingbot", "DuckDuckBot", "Yeti", "Daumoa", "Applebot" ];

export default async function DriveLayout({ children }) {
  const userData = await getUserv2();

  const ua = headers().get("user-agent") || "";
  const isAllowedBot = allowedBots.some(bot => ua.includes(bot));
  const content = (userData.login || isAllowedBot) ? children : <NoLoginComponent />;
  if (!isAllowedBot) { updateUserAccessDate(userData.email); }

  return (
    <div className="main-container">
      <NavBar navs={navData.navs} />
      <div className="content-container">{content}</div>
    </div>
  );
}