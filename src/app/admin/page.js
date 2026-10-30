/* @/app/admin/page.js */

// Styles (CSS)
import "@/styles/admin.css";
// Next
import { redirect } from "next/navigation";
import Link from "next/link";
// Components
import NavBar from "@/app/components/NavBar";
// Constants
import navData from "@/config/navConstant.json";
// Utils
import { getUserv2 } from "@/utils/getUser";

export default async function AdminPage() {
  // Load Static data
  const userData = await getUserv2();

  if (!userData?.admin) { redirect("/"); }

  return (
    <div className="main-container">
      <NavBar navs={navData.navs}/>
      <div className="container">
        <p><Link href="/admin/log" className="admin-href">로그 보기</Link></p>
        <p><Link href="/admin/user" className="admin-href">제보 보기</Link></p>
        <p><Link href="/admin/book" className="admin-href">도서 등록</Link></p>
      </div>
    </div>
  );
}