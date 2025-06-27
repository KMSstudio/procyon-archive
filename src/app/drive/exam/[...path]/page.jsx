// Components
import FileList from "./FileList";
import TrackClient from "@/app/components/MixPanel";
// Utils (Google Drive)
import { getExamFiles } from "@/utils/exam/examShow";
// Utils (User Logger)
import { getUserv2 } from "@/utils/auth";
import logger from "@/utils/logger";
// Utils (Exam Statistics)
import { countView } from "@/utils/exam/examStats";
// Styles (CSS)
import "@/styles/drive.css";
// Next Tags
import Link from "next/link";

export default async function ReferencePage({ params }) {
  const path = params.path ? `exam/${params.path.join("/")}` : "exam";

  const userData = await getUserv2();
  const decodedPath = decodeURIComponent(path);
  const folder = decodedPath.slice(5);
  logger.behavior(userData.fullName, "Google Drive 조회", decodedPath);

  // countView call, getExamFiles
  const countViewPromise = params.path?.length === 1 ? countView(params.path[0]) : Promise.resolve();
  const [_, files] = await Promise.all([countViewPromise, getExamFiles(path)]);

  const backPath =
    params.path && params.path.length > 1
      ? `/drive/exam/${params.path.slice(0, -1).join("/")}`
      : '/drice/exam';
  const eventName = `Exam Page Viewed: /drive/${decodedPath}`;

  return (
    <div className="container">
      <TrackClient
        user={{ email: userData.email, admin: userData.admin }}
        eventName={eventName}
      />

      <div className="filelist-content__title"><h1>Contents</h1></div>
      <FileList files={files} folder={folder} />
      <div id="filelist-control__links">
        <Link className="back-link" href="/">Home</Link>
        {backPath && (
          <Link className="back-link" href={backPath}>Back</Link>
        )}
      </div>
    </div>
  );
}