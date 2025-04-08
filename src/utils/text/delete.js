// @/utils/text/delete.js

import { deleteDBText, getDBText } from "@/utils/database/textDB";
import { google } from "googleapis";

// Google Drive 인증
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

/**
 * Deletes a markdown-based post from both Firestore and Google Drive.
 * Firestore deletion is awaited. Google Drive deletion is queued (not awaited).
 * If driveId is not provided, it will be fetched from Firestore using textId.
 *
 * @param {string} boardName - Board name (e.g., "notice")
 * @param {string} textId - ID of the post (used in Firestore)
 * @param {string|null} driveId - Google Drive file ID (optional)
 */
export async function deleteText(boardName, textId, driveId = null) {
  if (!boardName || !textId) { throw new Error("boardName and textId are required."); }
  // If driveId is not provided, retrieve it from Firestore
  if (!driveId) {
    const textData = await getDBText(boardName, textId);
    if (!textData || !textData.driveId) {
      console.warn(`No driveId found for textId '${textId}'`); driveId = null; }
    else { driveId = textData.driveId; }
  }
  
  // Delete from Firestore
  await deleteDBText(boardName, textId);
  // Delete from Google Drive
  if (driveId) {
    drive.files.delete({ fileId: driveId }).catch((err) => {
      console.error(`Failed to delete Drive file ${driveId}:`, err.message);
    });
  }
}