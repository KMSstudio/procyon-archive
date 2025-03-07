// components/NavBar.js
import Link from "next/link";
import "../styles/navbar.css"; // 네비게이션 스타일 가져오기

export default function NavBar({ user, navs }) {
  return (
    <header id="navbar">
      <h1>CSE Archive</h1>
      <nav className="nav">
        <Link href="/">Home</Link>
        {user ? <Link href="/logout">Logout</Link> : <Link href="/login/google">Login</Link>}
        {navs.map((nav, index) => (
          <Link key={index} href={nav.href}>
            {nav.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
