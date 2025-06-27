/*
 * @/app/drive/exam/[...path]/FileList.jsx
*/

// Component
import FileComponent from "./FileComponent";
import JeboFileComponent from "./JeboFileComponent";
// Style (CSS)
import "@/styles/components/list/filelist.css";

// Main component managing the file list
export default function FileList({ files, folder }) {
  return (
    <div className="file-list">
      {files.length > 0
        ? files.map((file) => <FileComponent key={file.id} file={file} />)
        : <div className="empty-message">No files or folders found.</div>}
      
      {/* Jebo Link */}
      {files.length > 0 && <JeboFileComponent folder={folder} />}
    </div>
  );
}