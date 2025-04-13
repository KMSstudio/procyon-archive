/* @/app/text/[boardName]/layout.js */

// Style (CSS)
import "@/styles/text.css";
// Next
import { redirect } from "next/navigation";
// Components
import NavBar from "@/app/components/NavBar";
import NoLoginComponent from "@/app/drive/no-login";
// Constants
import navData from "@/config/navConstant.json";
import boardConfig from "@/config/board-config.json";
// Utils
import { getUserv2 } from "@/utils/auth";
import { updateUserAccessDate } from "@/utils/database/userDB";

export default async function DriveLayout({ children, params }) {
  const { boardName } = params;
  const userData = await getUserv2();
  const content = userData.login ? children : <NoLoginComponent />;
  
  if (!boardConfig.hasOwnProperty(boardName)) redirect("/");
  updateUserAccessDate(userData.email);

  return (
    <div className="main-container">
      <NavBar navs={navData.navs} />
      <div className="content-container">{content}</div>
    </div>
  );
}