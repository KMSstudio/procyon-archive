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

export default async function ReferencePage() {
  const path = "exam";
  const userData = await getUserv2();
  logger.behavior(userData.fullName, "Google Drive 조회", path);
  // Get Exam File Contents
  const files = await getDriveFiles(path);
  return (
    <div className="content-container-vert">
      <TrackClient
        user={{ email: userData.email, admin: userData.admin }}
        eventName={`Drive Page Viewed: /drive/exam`}
      />
      <div className="container">
        {/* Header Section */}
        <header><h1>Contents of Reference</h1></header>
        {/* FileList Section */}
        <FileList files={files} />
        {/* Control Links Section */}
        <div id="filelist-control-links">
          <Link className="back-link" href="/">Home</Link>
        </div>
      </div>
    </div>
  );
}