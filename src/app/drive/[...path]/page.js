/*
 * @/app/drive/[...path]/page.js
*/

// Components
import NavBar from "@/app/components/NavBar";
import FileList from "@/app/components/FileList";
// Utils (Google Drive)
import { getDriveFiles } from "@/utils/drive/show";
// Constants
import extListsData from "@/config/extLists.json";
import navData from "@/config/navConstant.json";
// Styles (CSS)
import "@/app/styles/filelist.css";
// Next Tags
import Link from "next/link";

export default async function ReferencePage({ params }) {
  const path = params.path ? params.path.join("/") : "";
  const files = await getDriveFiles(path);

  const backPath = params.path && params.path.length > 1
    ? `/drive/${params.path.slice(0, -1).join("/")}`
    : null;

  // Navigation Data
  const { navs = [], links = [], buttons = [] } = navData;
  const extLists = extListsData;

  return (
    <div className="main-container">
      <NavBar navs={navs} />
      <div className="container">
        <header>
          <h1>Contents of Reference</h1>
          <div className="button-group"></div>
        </header>

        <FileList files={files} extLists={extLists} />

        <div className="control-links">
          <Link className="back-link" href="/">
            Home
          </Link>
          {backPath && (
            <Link className="back-link" href={backPath}>
              Back
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}