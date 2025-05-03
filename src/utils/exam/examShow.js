// @/utils/exam/examShow.js

import { getDriveFiles } from "@/utils/drive/show";

const cache = new Map();
const timestamps = new Map();
const ttl = (process.env.TTL_EXAM_DB).split("*").map(Number).reduce((a, b) => a * b, 1);

/**
 * Returns the list of files in a given exam folder path.
 * If the path depth is less than 3, the result is cached.
 * @param {string} folderPath - e.g., 'exam/2024/algorithm'
 * @returns {Promise<Array>} - List of file objects
 */
export async function getExamFiles(folderPath) {
  const depth = folderPath.split("/").filter(Boolean).length;
  if (depth >= 3) return await getDriveFiles(folderPath);

  const now = Date.now();
  if (cache.has(folderPath) && now - timestamps.get(folderPath) < ttl) return cache.get(folderPath);

  const files = await getDriveFiles(folderPath);
  cache.set(folderPath, files);
  timestamps.set(folderPath, now);
  return files;
}