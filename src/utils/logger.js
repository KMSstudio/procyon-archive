// @/utils/logger.js

// @/utils/logger.js

class Logger {
  constructor() {
    this.buffer = [];
    this.flushInterval = null;
    this.#initFlushTimers();
  }

  log(msg) { this.write("LOG", msg); }
  info(msg) { this.write("INFO", msg); }
  error(msg) { this.write("ERROR", msg); }

  write(type, msg) {
    const now = new Date().toISOString();
    this.buffer.push(`[${now}] ${type}: ${msg}`);
  }

  #initFlushTimers() {
    this.#scheduleHourlyFlush();
    this.#scheduleDailyFlush();
  }

  #scheduleHourlyFlush() {
    const intervalHour = parseInt(process.env.LOGGER_HOUR_INTERVAL || "2"); // default to 2
    const now = new Date();
    const next = new Date(now);
  
    next.setMinutes(0, 0, 0);
    const nextHour = Math.ceil(now.getHours() / intervalHour) * intervalHour;
    next.setHours(nextHour);
  
    const msUntilNext = next - now;
    setTimeout(() => {
      this.flush("hourly");
      setInterval(() => this.flush("hourly"), 1000 * 60 * 60 * intervalHour);
    }, msUntilNext);
  }

  #scheduleDailyFlush() {
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

  flush(type = "manual") {
    if (this.buffer.length === 0) return null;

    const content = this.buffer.join("\n") + "\n";
    this.buffer = [];
    return content;
  }

  getBuffer() { return this.buffer.join("\n"); }
  getRawBBuffer() { return this.buffer; }
}

const logger = new Logger();
export default logger;