/* @/app/admin/page.js */

// Styles (CSS)
import "@/styles/admin.css";
// Next
import { redirect } from "next/navigation";
// Components
import NavBar from "@/app/components/NavBar";
import UserSection from "@/app/components/admin/usersection";
import LogSection from "@/app/components/admin/logsection";
// Constants
import navData from "@/config/navConstant.json";
// Utils
import { getUserv2 } from "@/utils/auth";
import { fetchAllUser } from "@/utils/database/userDB";

export default async function AdminPage() {
  // Load Static data
  const userData = await getUserv2();
  
  if (!userData?.admin) { redirect("/"); }
  const users = await fetchAllUser();

  return (
    <div className="main-container">
      <NavBar navs={navData.navs}/>
      <div className="content-container">
        <div className="admin-sections">
          <UserSection users={users} />
          <LogSection />
        </div>
      </div>
    </div>
  );
}