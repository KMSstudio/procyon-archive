/*
 * @/app/components/unique/logsection.js
 */

import logger from "@/utils/logger";
import "@/styles/components/admin/logsection.css";

export default async function LogSection() {
  let logs = [];

  try {
    logs = logger.getRawBuffer();
  } catch (err) {
    console.error("Failed to fetch logs:", err);
  }

  return (
    <section id="log-section">
      <h2>Log</h2>
      <div className="log-list">
        {logs?.map((log, index) => (
          <div key={index} className="log-item">
            {log}
          </div>
        ))}
      </div>
    </section>
  );
}