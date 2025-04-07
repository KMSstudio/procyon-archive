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

    if (msg.includes("강명석")) { return; }
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
      let logs = [];
      let lastDoc = null;
  
      do {
        const query = logCollection
          .orderBy("timestamp", "asc")
          .startAfter(lastDoc || 0)
          .limit(1000);
        const snapshot = await query.get();
        if (snapshot.empty) break;
  
        snapshot.docs.forEach((doc) => {
          const { timestring, type, msg } = doc.data();
          logs.push(`[${timestring}] ${type}: ${msg}`);
        });
        lastDoc = snapshot.docs[snapshot.docs.length - 1];
      } while(snapshot.docs.length < 1000);

      return logs;
    } catch (error) {
      console.error("Failed to retrieve string logs logger.js/getBuffer: ", error);
      return [];
    }
  }  

  async flush() {
    try {
      const snapshot = await logCollection.get();
      const batch = db.batch();
  
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
  
      await batch.commit();
      console.log("All logs flushed from Firestore.");
    } catch (error) {
      console.error("Failed to flush logs from Firestore:", error);
    }
  }
}

const logger = new Logger();
export default logger;