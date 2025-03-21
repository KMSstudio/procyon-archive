// Next-auth
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Components
import NavBar from "@/app/components/NavBar";
import NoLoginComponent from "@/app/drive/no-login";
// Constants
import navData from "@/config/navConstant.json";
import { getUserInfo } from "@/utils/auth";
import { updateUserAccess } from "@/utils/database/userDB"
// Style (CSS)
import "@/app/styles/drive.css";

export default async function DriveLayout({ children }) {
  const session = await getServerSession(authOptions);
  const userData = await getUserInfo(session);
  const content = userData.do_user_login ? children : <NoLoginComponent />;
  updateUserAccess(userData.user_email, userData.user_info);

  return (
    <div className="main-container">
      <NavBar navs={navData.navs} />
      <div className="content-container">{content}</div>
    </div>
  );
}