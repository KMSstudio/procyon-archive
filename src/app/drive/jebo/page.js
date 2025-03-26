/* @/app/drive/jebo/page.js */

"use client";

import "@/app/styles/drive.css";
import JeboConsole from "@/app/components/console/JeboConsole";

export default function JeboDrivePage() {
  return (
    <div className="container">
      <header>
        <h1>Jebo to CSE:Archive</h1>
      </header>
      <JeboConsole />
    </div>
  );
}