/* @/app/drive/layout.js */

// Components
import NavBar from "@/app/components/NavBar";
import NoLoginComponent from "@/app/drive/no-login";
// Constants
import navData from "@/config/navConstant.json";
import { getUserv2 } from "@/utils/getUser";
import { updateUserAccessDate } from "@/repository/userDB"
// Style (CSS)
import "@/styles/drive.css";

export default async function DriveLayout({ children }) {
  const userData = await getUserv2();
  const content = userData.login ? children : <NoLoginComponent />;
  updateUserAccessDate(userData.email);

  return (
    <div className="main-container">
      <NavBar navs={navData.navs} />
      {content}
    </div>
  );
}