"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "../styles/navbar.css";

export default function NavBar({ navs }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header id="navbar">
      <h1>CSE Archive</h1>
      <nav className="nav">
        <Link href="/">Home</Link>
        {/* User Login */}
        {session ? (
          <Link href={pathname} onClick={(e) => { e.preventDefault(); signOut({ callbackUrl: pathname }); }}>
            Logout
          </Link>
        ) : (
          <Link href={pathname} onClick={(e) => { e.preventDefault(); signIn("google", { callbackUrl: pathname }); }}>
            Login
          </Link>
        )}
        {/* Navigation */}
        {navs &&
          navs.map((nav, index) => (
            <Link key={index} href={nav.href}>
              {nav.name}
            </Link>
          ))}
      </nav>
    </header>
  );
}