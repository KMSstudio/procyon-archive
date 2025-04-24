"use client";

/*
 * @/app/components/NavBar.js
*/

import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "@/styles/components/navbar.css";

export default function NavBar({ navs }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header id="navbar">
      {/* Logo Image */}
      <Link href="/" className="navbar-logo-container">
        <picture>
          <source srcSet="/image/logo/full-white.avif" type="image/avif" />
          <source srcSet="/image/logo/full-white.webp" type="image/webp" />
          <img src="/image/logo/full-white.png" alt="CSE Archive Logo" className="navbar-logo" />
        </picture>
        <picture>
          <source srcSet="/image/logo/highlight-white.avif" type="image/avif" />
          <source srcSet="/image/logo/highlight-white.webp" type="image/webp" />
          <img src="/image/logo/highlight-white.png" alt="CSE Archive Logo" className="navbar-hover-logo" />
        </picture>
      </Link>
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