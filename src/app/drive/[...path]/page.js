// Components
import NavBar from "@/app/components/NavBar";
import ReferenceFileList from "@/app/components/FileList";
// Constants
import extListsData from "@/config/extLists.json";
import navData from "@/config/navConstant.json";
// Next Tags
import Link from "next/link";

export default async function ReferencePage({ params }) {
  const path = params.path ? `/${params.path.join("/")}` : "";
  const fetchUrl = `${process.env.BASE_URL}/api/drive/show${path}`;

  let files = [];

  try {
    const response = await fetch(fetchUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch files");
    }
    files = await response.json();
  } catch (error) {
    console.error("Error fetching files:", error);
  }

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

        <ReferenceFileList files={files} extLists={extLists} />

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