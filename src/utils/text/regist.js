// @/utils/text/regist.js

import { v4 as uuidv4 } from "uuid";
import { putDriveText } from "@/utils/drive/text";
import { createDBText } from "@/utils/database/textDB";

/**
 * Registers a new markdown-based post by uploading it to Google Drive
 * and saving metadata in Firestore.
 *
 * @param {string} boardName - Board name (e.g., "notice", "general")
 * @param {string} title - Title of the post
 * @param {string} markdown - Markdown content to save
 * @param {string} uploaderEmail - Email address of the uploader
 * @param {string} uploaderName - Display name of the uploader
 * @returns {Promise<{ id: string, driveId: string }>} - Text ID and Drive file ID
 */
export async function registerText(boardName, title, markdown, uploaderEmail, uploaderName) {
  if (!boardName || !title || !markdown || !uploaderEmail || !uploaderName) {
    throw new Error("All parameters are required: boardName, title, markdown, uploaderEmail, uploaderName."); }
  const textId = uuidv4().replace(/-/g, "").slice(0, 12);
  const fileName = `${textId}.md`;
  const drivePath = `text/${boardName}`;

  console.log("registerText() begin");

  // Upload markdown to Google Drive
  console.log("upload to Google Drive begin");
  const driveId = await putDriveText(drivePath, fileName, markdown);
  // Save metadata to Firestore
  console.log("upload to Firebase begin");
  await createDBText(boardName, {
    id: textId,
    title,
    uploaderEmail,
    uploaderName,
    driveId,
    createDate: new Date().toISOString(),
  });
  return { id: textId, driveId };
}