// pages/api/cron/logger-hourly.js
import logger from "@/utils/logger";

export default async function handler(req, res) {
  await logger.flush("hourly");
  res.status(200).send("Flushed hourly logs.");
}