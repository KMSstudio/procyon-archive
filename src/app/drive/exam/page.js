/* @/app/drive/exam/page.js */

// Components
import ExamFileList from "@/app/components/list/ExamFileList";
import TrackClient from "@/app/components/MixPanel";
// Utils (Google Drive)
import { getExamFiles } from "@/utils/exam/examShow";
// Utils (User Logger)
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";
// Utils
import { getHotExams } from "@/utils/exam/viewStats";
// Styles (CSS)
import "@/styles/drive.css";

export default async function ReferencePage() {
  const path = "exam";
  const userData = await getUserv2();
  logger.behavior(userData.fullName, "Google Drive 조회", path);
  // Get Exam File Contents
  const [files, hotFiles] = await Promise.all([
    getExamFiles(path),
    getHotExams()
  ]);
  // Retrun Page
  return (
    <div className="content-container-vert">
      <TrackClient
        user={{ email: userData.email, admin: userData.admin }}
        eventName={`Exam Page Viewed: /drive/exam`}
      />
      <ExamFileList files={files} hotFiles={hotFiles} />
    </div>
  );
}