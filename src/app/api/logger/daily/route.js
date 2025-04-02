// pages/api//logger-hourly.js
import logger from "@/utils/logger";

export default async function handler(req, res) {
  await logger.flush("daily");
  res.status(200).send("Flushed daily logs.");
}