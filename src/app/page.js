"use client";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import ButtonList from "./components/ButtonList";
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
          <div className="main-content-title">
            <h1>SNUCSE DB</h1>
            <p>Seoul National University - Computer Science and Engineering Database</p>
          </div>
          <ButtonList buttons={buttons} />
          <div className="special-thanks">
            <a href="/">Special Thanks</a>
          </div>
        </main>
      </div>
    </div>
  );
}
