/* @/app/components/console/JeboConsole.js */

"use client";

import { useState } from "react";
// Style (CSS)
import "@/styles/components/console/jeboconsole.css";
import "@/styles/components/list/filelist.css";

function PendingFileList({ files }) {
  if (!files || files.length === 0) {
    return <div className="empty-message">업로드 된 파일이 없습니다.</div>;
  }

  return (
    <div className="file-list">
      {files.map((file) => (
        <div key={file.id} className="file-item" data-file-name={file.name} data-file-ext={file.ext}>
          <img src={file.img} alt="File Icon" className="file-icon" />
          <p className="pending-file-name">{file.name}</p>
        </div>
      ))}
    </div>
  );
}

export default function JeboConsole() {
  const [reportName, setReportName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles([...files, ...selected]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportName || files.length === 0) {
      alert("제보 이름과 파일을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("reportName", reportName);
    formData.append("description", description);
    files.forEach((file) => formData.append("files", file));
  
    setIsSubmitting(true);
    setUploadPercent(0);
  
    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
  
        xhr.open("POST", "/api/drive/jebo/upload", true);
  
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadPercent(percent);
          }
          else { console.log("length not computable"); }
        };
  
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`업로드 실패: ${xhr.statusText}`));
          }
        };
  
        xhr.onerror = () => reject(new Error("요청 중 네트워크 오류 발생"));
        xhr.send(formData);
      });
  
      alert("제보가 성공적으로 업로드되었습니다.");
      setReportName("");
      setDescription("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("업로드에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
      setUploadPercent(null);
    }
  };  

  const fileListObjects = files.map((file, i) => ({
    id: `${i}-${file.name}`,
    name: file.name,
    img: "/image/ico/file.png",
    isFolder: false,
    ext: file.name.split(".").pop().toLowerCase(),
  }));

  return (
    <form onSubmit={handleSubmit} id="jebo-container">
      <input
        type="text"
        placeholder="제보의 제목을 입력하세요"
        value={reportName}
        onChange={(e) => setReportName(e.target.value)}
        required
      />

      <textarea
        placeholder="자료에 대한 간단한 설명을 작성해주세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
      />

      <PendingFileList files={fileListObjects} />

      <div id="jebo-file-select-group">
        <label className="buttons">
          <span>파일 추가</span>
          <input type="file" multiple onChange={handleFileChange} style={{ display: "none" }} />
        </label>

        <button className="buttons" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? uploadPercent !== null
              ? `업로드 중... ${uploadPercent}%`
              : "제출 중..."
            : "제보 제출"}
        </button>
      </div>
    </form>
  );
}