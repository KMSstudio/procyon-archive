"use client";
import { useEffect, useState } from "react";
import ReferenceFileList from "../../components/FileList";
import { usePathname } from "next/navigation";

export default function ReferencePage() {
  const [files, setFiles] = useState([]);
  const [extLists, setExtLists] = useState({});
  const pathname = usePathname(); // Get current path

  useEffect(() => {
    if (!pathname) return;

    fetch(`/api/drive/reference${pathname.replace("/reference", "")}`)
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((error) => console.error("Error fetching files:", error));

    fetch("/api/const/ext")
      .then((res) => res.json())
      .then((data) => setExtLists(data))
      .catch((error) => console.error("Error fetching extension list:", error));
  }, [pathname]);

  return (
    <div>
      <h1>Reference 파일 목록</h1>
      <ReferenceFileList files={files} extLists={extLists} />
    </div>
  );
}
