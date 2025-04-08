"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BoardWritePage({ params }) {
  const { boardName } = params;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/text/write`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardName, title, markdown }),
    });

    const data = await res.json();
    if (data.success) {
      router.push(`/text/${boardName}/view/${data.driveId}`);
    } else {
      alert("Upload failed: " + data.error);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "40px auto" }}>
      <h1>Write Post to /{boardName}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", fontSize: "16px", marginBottom: "10px" }}
          required
        />
        <textarea
          placeholder="Markdown content here..."
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={15}
          style={{ width: "100%", padding: "8px", fontSize: "14px" }}
          required
        />
        <button type="submit" disabled={loading} style={{ marginTop: "10px" }}>
          {loading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}