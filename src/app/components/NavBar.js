"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import "../styles/navbar.css";

export default function NavBar({ navs }) {
  const { data: session } = useSession();

  return (
    <header id="navbar">
      <h1>CSE Archive</h1>
      <nav className="nav">
        <Link href="/">Home</Link>
        {/* Login Link */}
        {session ? (
          <Link href="/user/logout">Logout</Link>
        ) : (
          <Link href="/user/login">Login</Link>
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