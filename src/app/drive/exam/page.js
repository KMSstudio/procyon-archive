/* @/app/drive/exam/[...path]/page.js */

// Components
import ExamFileList from "@/app/components/list/ExamFileList";
import TrackClient from "@/app/components/MixPanel";
// Utils (Google Drive)
import { getDriveFiles } from "@/utils/drive/show";
// Utils (User Logger)
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";
// Styles (CSS)
import "@/styles/drive.css";

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
        eventName={`Exam Page Viewed: /drive/exam`}
      />
      <ExamFileList files={files} />
    </div>
  );
}