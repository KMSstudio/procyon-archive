/*
 * @/app/drive/exam/[...path]/JeboFileListComponent.jsx
*/

"use client";
// React
import { useState } from "react";
// Style (CSS)
import "@/styles/components/list/filelist.css";

export default function JeboFileComponent({ folder }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    year: "",
    semester: "",
    type: "",
    comment: "",
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async () => {
    const { year, semester, type, comment, file } = form;
    if (!folder || !year || !type || !file) return alert("필수 항목을 입력해주세요");
    // Make Data
    const data = new FormData();
    data.append("folder", folder);
    data.append("year", year);
    if (semester) data.append("semester", semester);
    data.append("type", type);
    if (comment) data.append("comment", comment);
    data.append("file", file);
    // Call API
    setUploading(true);
    try {
      const res = await fetch("/api/drive/jebo/upload-direct", { method: "POST", body: data });
      if (!res.ok) throw new Error();
      setDone(true);
      setForm({ year: "", semester: "", type: "", comment: "", file: null });
    }
    catch { alert("업로드에 실패했습니다."); }
    finally { setUploading(false); }
  };

  return (
    <div className="file-item" >
      <img src="/image/filelist/givemejebo.png" alt="Suggest Icon" className="file-icon" />

      { showForm ? (
        <div className="jebo-form">
          <input name="year" placeholder="년도 (예: 2024)" value={form.year} onChange={handleChange} />
          <input name="semester" placeholder="학기 (1 or 2)" value={form.semester} onChange={handleChange} />
          <input name="type" placeholder="족보 타입 (예: 기말)" value={form.type} onChange={handleChange} />
          <input name="comment" placeholder="코멘트 (선택)" value={form.comment} onChange={handleChange} />
          <input name="file" type="file" onChange={handleChange} />
          <button onClick={handleSubmit} disabled={uploading}>
            {uploading ? "업로드 중..." : "제보 제출"}
          </button>
          {done && <p style={{ color: "green" }}>업로드가 완료되었습니다.</p>}
        </div>
      ) : (
        <a className="jebo-item__title" onClick={() => setShowForm(!showForm)}>
          자료 제보를 해주세요
        </a>
      )}
    </div>
  );
}
