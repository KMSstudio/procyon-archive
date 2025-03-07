"use client";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import "./styles/index.css";

export default function HomePage() {
  const [navs, setNavs] = useState([]);
  const [links, setLinks] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/nav")
      .then((res) => res.json())
      .then((data) => {
        setNavs(data.navs);
        setLinks(data.links);
        setButtons(data.buttons);
        setIsAdmin(data.is_admin);
        setUser(data.user);
      });
  }, []);

  return (
    <div className="main-container">
      <NavBar user={user} navs={navs} />
      <div className="content-container">
        <Sidebar isAdmin={isAdmin} links={links} />
        <main className="main-content">
          {/* Main Title */}
          <div className="main-content-title">
            <h1>Procyon</h1>
            <p>Seoul National University - Computer Science and Engineering Archive</p>
          </div>
          {/* Button List */}
          <div className="buttons">
            {buttons.map((button, index) => (
              <form key={index} action={button.href} method="get">
                <button type="submit">{button.name}</button>
              </form>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
