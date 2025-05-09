/* @/app/components/unique/logsection.js */

import logger from "@/utils/logger";
import "@/styles/components/admin/logsection.css";

export default async function LogSection() {
  const logs = await logger.getBuffer();
  const displayTime = new Date(Date.now() + 9 * 3600 * 1000).toISOString();

  return (
    <section id="log-section">
      <h2>Log</h2>
      <div className="log-list">
        <div className="log-item log-console">
          [{displayTime}]{" "}
          <a href="/api/log/download" target="_blank" rel="noopener noreferrer">
            download
          </a>{" "}
          |{" "}
          <form method="POST" action="/api/log/export" style={{ display: "inline" }}>
            <button type="submit" className="console-button">
              export
            </button>
          </form>{" "}
          |{" "}
          <form method="POST" action="/api/log/flush" style={{ display: "inline" }}>
            <button type="submit" className="console-button">
              flush
            </button>
          </form>
        </div>
        {logs?.map((log, index) => (
          <div key={index} className="log-item">
            {log}
          </div>
        ))}
      </div>
    </section>
  );
}