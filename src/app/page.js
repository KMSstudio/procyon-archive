"use client";
import { useState, useEffect } from "react";

import NavBar from "./components/NavBar";
import Sidebar from "@/app/components/Sidebar";

import "./styles/index.css";

import { getCachedData } from "@/utils/cache";

export default function HomePage() {
  const [navs, setNavs] = useState([]);
  const [links, setLinks] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Navigation Bar Data
    getCachedData("navLists", "/api/const/nav").then((data) => {
      if (data) {
        setNavs(data.navs || []);
        setLinks(data.links || []);
        setButtons(data.buttons || []);
      }
    });

    // Get User Info
    fetch("/api/user/info")
      .then((res) => res.json())
      .then((data) => {
        setIsAdmin(data.is_user_admin);
      })
      .catch((err) => console.error("Failed to fetch user info:", err));
  }, []);

  return (
    <div className="main-container">
      <NavBar navs={navs} />
      <div className="content-container">
        <Sidebar isAdmin={isAdmin} links={links} />
        <main className="main-content">
          <div className="main-content-title">
            <h1>Procyon</h1>
            <p>Seoul National University - Computer Science and Engineering Archive</p>
          </div>
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