/* @/app/drive/exam/[...path]/page.js */

// Components
import FileList from "@/app/components/list/FileList";
import TrackClient from "@/app/components/MixPanel";
// Utils (Google Drive)
import { getDriveFiles } from "@/utils/drive/show";
// Utils (User Logger)
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";
// Styles (CSS)
import "@/styles/drive.css";
// Next Tags
import Link from "next/link";

export default async function ReferencePage({ params }) {
  const path = params.path ? `exam/${params.path.join("/")}` : "exam";

  const userData = await getUserv2();
  const decodedPath = decodeURIComponent(path);
  logger.behavior(userData.fullName, "Google Drive 조회", decodedPath);
  
  const files = await getDriveFiles(path);
  const backPath =
    params.path && params.path.length > 1
      ? `/drive/exam/${params.path.slice(0, -1).join("/")}`
      : null;
  const eventName = `Drive Page Viewed: /drive/${decodedPath}`;

  return (
    <div className="container">
      <TrackClient
        user={{ email: userData.email, admin: userData.admin }}
        eventName={eventName}
      />

      <header>
        <h1>Contents of Reference</h1>
      </header>

      <FileList files={files} />

      <div id="filelist-control-links">
        <Link className="back-link" href="/">Home</Link>
        {backPath && (
          <Link className="back-link" href={backPath}>Back</Link>
        )}
      </div>
    </div>
  );
}