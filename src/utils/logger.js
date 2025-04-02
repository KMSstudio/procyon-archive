// @/utils/logger.js

import { uploadLogFile } from "@/utils/drive/logger";

class Logger {
  constructor() {
    this.buffer = [];
    this.flushInterval = null;
    this.initFlushTimers();
  }

  log(msg) { this.write("LOG", msg); }
  info(msg) { this.write("INFO", msg); }
  error(msg) { this.write("ERROR", msg); }

  write(type, msg) {
    const now = new Date().toISOString();
    this.buffer.push(`[${now}] ${type}: ${msg}`);
  }

  initFlushTimers() {
    this.scheduleHourlyFlush();
    this.scheduleDailyFlush();
  }

  scheduleHourlyFlush() {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(Math.ceil(now.getHours() / 2) * 2);

    const msUntilNextFlush = nextHour - now;
    setTimeout(() => {
      this.flush("hourly");
      setInterval(() => this.flush("hourly"), 1000 * 60 * 2); // 2-hour(minute) interval
    }, msUntilNextFlush);
  }

  scheduleDailyFlush() {
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setHours(0, 0, 0, 0);
    nextDay.setDate(now.getDate() + 1);

    const msUntilMidnight = nextDay - now;
    setTimeout(() => {
      this.flush("daily");
      setInterval(() => this.flush("daily"), 1000 * 60 * 60 * 24); // every midnight
    }, msUntilMidnight);
  }

  async flush(type) {
    if (this.buffer.length === 0) return;

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const hourStr = String(now.getHours()).padStart(2, "0");

    const filename = type === "hourly"
      ? `${dateStr} ${hourStr}.txt`
      : `${dateStr}.txt`;

    const content = this.buffer.join("\n") + "\n";
    this.buffer = [];

    try {
      await uploadLogFile(filename, content);
    } catch (err) {
      console.error("Logger flush failed:", err);
    }
  }
}

const logger = new Logger();
export default logger;