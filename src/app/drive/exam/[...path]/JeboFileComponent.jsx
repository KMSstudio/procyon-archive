/*
 * @/app/drive/exam/[...path]/JeboFileListComponent.jsx
*/

"use client";
// React
import { useState } from "react";
// Style (CSS)
import "@/styles/components/list/filelist.css";
import "@/styles/components/drive/jebo-file-component.css"

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
      setTimeout(() => setDone(false), 3000);
    }
    catch { alert("업로드에 실패했습니다."); }
    finally { setUploading(false); }
  };

  return (
    <div className="file-item" >
      <img src="/image/filelist/givemejebo.png" alt="Suggest Icon" className="file-icon" />

      { showForm ? (
        <div className="jebo-form">
          {/* Title of Jebo */}
          <div className="jebo-form__titlebar">
            <p className="jebo-form__title" onClick={() => setShowForm(!showForm)}>즉시 제보 업로드</p>
            <a href="/drive/jebo" className="jebo-form__title-link">이전처럼 제보하기</a>
          </div>
          {/* Input Fields */}
          <div className="jebo-form__grid">
            <input className="jebo-form__year" name="year" placeholder="년도* (2024)" value={form.year} onChange={handleChange} />
            <input className="jebo-form__semester" name="semester" placeholder="학기 (1, 2)" value={form.semester} onChange={handleChange} />
            <input className="jebo-form__type" name="type" placeholder="족보 타입* (중간, 기말)" value={form.type} onChange={handleChange} />

            <input className="jebo-form__comment" name="comment" placeholder="코멘트" value={form.comment} onChange={handleChange} />
            <div className="jebo-form__file-wrapper">
              <label className="jebo-form__file-label">
                {form.file ? form.file.name : "파일 선택하기"}
                <input
                  type="file"
                  name="file"
                  className="jebo-form__file"
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
          {/* Submit */}
          <div className="jebo-form__submit">
            <button className="jebo-form__button" onClick={handleSubmit} disabled={uploading}>
              {uploading ? "업로드 중..." : "제보 제출"}
            </button>
            {done
              ? (<p className="jebo-form__done-msg">업로드가 완료되었습니다.</p>)
              : (form.year && form.type && form.file && (
                <p className="jebo-form__filename-msg">
                  {`${folder} ${form.year}${form.semester ? "." + form.semester : ""} ${form.type}${form.comment ? " " + form.comment : ""}.${form.file.name.split(".").pop()}`}</p>)
            )}
          </div>
        </div>
      ) : (
        <a className="jebo-item__title" onClick={() => setShowForm(!showForm)}>
          자료 제보를 해주세요
        </a>
      )}
    </div>
  );
}
