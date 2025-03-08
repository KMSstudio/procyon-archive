"use client";
import { useEffect, useState } from "react";

import NavBar from "@/app/components/NavBar";
import ReferenceFileList from "../../components/FileList";

import { usePathname } from "next/navigation";
import { getCachedData } from "@/utils/cache";

export default function ReferencePage() {
  // Nav
  const [navs, setNavs] = useState([]);
  const [links, setLinks] = useState([]);
  const [buttons, setButtons] = useState([]);
  // File List
  const [files, setFiles] = useState([]);
  // Extension List
  const [extLists, setExtLists] = useState({});
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    if (!pathname) return;

    fetch(`/api/drive/show/${pathname.replace("/drive", "")}`)
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error("Error fetching files:", error));

    // File Extension Icon Data
    getCachedData("extLists", "/api/const/ext").then(setExtLists);

    // Navigation Bar Data
    getCachedData("navLists", "/api/const/nav").then((data) => {
      if (data) {
        setNavs(data.navs || []);
        setLinks(data.links || []);
        setButtons(data.buttons || []);
      }
    });
  }, [pathname]);

  return (
    <div className="main-container">
      <NavBar navs={navs} />
      <div className="container">
        <header>
            <h1>Contents of Reference</h1>
            <div className="button-group"></div>
        </header>

        <ReferenceFileList files={files} extLists={extLists} />
        {/* <div class="control-links">
            <a class="back-link" href="<%= backto %>">Go Back</a>
            <a class="back-link" href="/">Go Home</a>
        </div> */}
      </div>
    </div>
  );
}
