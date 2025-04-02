/*
* @/app/admin/page.js
*/

// Styles (CSS)
import "@/styles/admin.css";
// Components
import NavBar from "@/app/components/NavBar";
import UserSection from "@/app/components/admin/usersection";
import JeboSection from "@/app/components/admin/jebosection";
// Redirect
import { redirect } from "next/navigation";
// Constants
import navData from "@/config/navConstant.json";
// Utils
import { getUserv2 } from "@/utils/auth";
import { fetchAllUser } from "@/utils/database/userDB";
import { getDriveFiles } from "@/utils/drive/show";

export default async function AdminPage() {
  // Load Static data
  const userData = await getUserv2();
  
  if (!userData?.admin) { redirect("/"); }
  const users = await fetchAllUser();
  const jebos = (await getDriveFiles("jebo")).filter((f) => f.isFolder);

  return (
    <div className="admin-container">
      <NavBar navs={navData.navs}/>
      <main className="admin-main">
        <div className="admin-sections">
          <UserSection users={users} />
          <JeboSection jebos={jebos}/>
        </div>
      </main>
    </div>
  );
}