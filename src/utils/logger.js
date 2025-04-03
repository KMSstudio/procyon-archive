// @/utils/logger.js

// @/utils/logger.js

class Logger {
  constructor() {
    this.buffer = [];
    this.flushInterval = null;
  }

  log(msg) { this.write("LOG", msg); }
  info(msg) { this.write("INFO", msg); }
  error(msg) { this.write("ERROR", msg); }

  write(type, msg) {
    console.log(`${JSON.stringify(this.buffer)}`)
    const now = new Date().toISOString();
    this.buffer.push(`[${now}] ${type}: ${msg}`);
  }

  flush(type = "manual") {
    console.log(`flush type = ${type}`);
    if (this.buffer.length === 0) return null;

    const content = this.buffer.join("\n") + "\n";
    this.buffer = [];
    return content;
  }

  getBuffer() { return this.buffer.join("\n"); }
  getRawBuffer() { return this.buffer; }
}

const logger = new Logger();
export default logger;