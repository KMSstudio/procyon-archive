/* @/app/drive/no-admin.js */

"use client";

import { useRouter } from "next/navigation";
import "@/styles/err/login.css";

export default function NoAdminComponent() {
  const router = useRouter();

  console.log("hello")

  return (
    <div id="login-error-main-page">
      <h1>This Page is Shut Downed</h1>
      <button onClick={() => router.push("/")}>
        <img src="/image/ico/home.png" alt="Home Icon" className="google-icon" />
        Go to the Main Page
      </button>
    </div>
  );
}