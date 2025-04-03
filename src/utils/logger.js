// @/utils/logger.js

import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const logCollection = db.collection(process.env.FIRE_DB_LOG_TABLE);

class Logger {
  log(msg) { this.write("LOG", msg); }
  info(msg) { this.write("INFO", msg); }
  error(msg) { this.write("ERROR", msg); }

  async write(type, msg) {
    const now = new Date(Date.now() + 9 * 3600 * 1000);
    const logEntry = {
      timestamp: now.getTime(),
      timestring: now.toISOString(),
      type,
      msg,
    };

    try {
      await logCollection.add(logEntry);
      console.log(`Firestore Logged [${type}]: ${msg}`);
    } catch (error) {
      console.error("Failed to write log to Firestore:", error);
    }
  }

  async getRawBuffer() {
    try {
      const snapshot = await logCollection.orderBy("timestamp", "asc").get();
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Failed to retrieve raw logs:", error);
      return [];
    }
  }

  async getBuffer() {
    try {
      const snapshot = await logCollection.orderBy("timestamp", "asc").get();
      return snapshot.docs.map(doc => {
        const { timestring, type, msg } = doc.data();
        return `[${timestring}] ${type}: ${msg}`;
      });
    } catch (error) {
      console.error("Failed to retrieve string logs:", error);
      return [];
    }
  }
}

const logger = new Logger();
export default logger;