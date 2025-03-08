"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ReferenceFileList() {
  const [files, setFiles] = useState([]);
  const pathname = usePathname(); // 현재 경로 가져오기

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api${pathname}`);
        const data = await response.json();
        if (response.ok) {
          setFiles(data);
        } else {
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("파일 목록을 가져오는데 실패:", error);
      }
    };
    fetchFiles();
  }, [pathname]);

  return (
    <div>
      <h2>Google Drive 파일 목록</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            📂 {file.name} -{" "}
            <a href={file.webViewLink} target="_blank" rel="noopener noreferrer">
              보기
            </a>{" "}
            |{" "}
            <a href={file.downloadLink} download>
              다운로드
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
