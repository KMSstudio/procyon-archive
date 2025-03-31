"use client";

// React
import { useEffect } from "react";
// Next
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// Component
import NavBar from "@/app/components/NavBar";
// Style
import "@/styles/err/login.css";
import "@/styles/err/browser.css"
// Navdata
import navData from "@/config/navConstant.json";

export default function LoginLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { navs = [] } = navData;

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="main-container">
      <NavBar navs={navs} />
      <div className="content-container">{children}</div>
    </div>
  );
}