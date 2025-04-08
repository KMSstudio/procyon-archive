// @/utils/text/modify.js

import { updateDBText } from "@/utils/database/textDB";
import { google } from "googleapis";

// Google Drive 인증
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

/**
 * Modifies an existing markdown-based post on Google Drive and Firestore.
 *
 * @param {string} boardName - Board name
 * @param {string} textId - Text ID (used in Firestore)
 * @param {string} driveId - Drive file ID of the .md file
 * @param {string} newTitle - New title to update
 * @param {string} newMarkdown - New markdown content
 */
export async function modifyText(boardName, textId, driveId, newTitle, newMarkdown) {
  if (!boardName || !textId || !driveId || !newTitle || !newMarkdown) {
    throw new Error("All parameters are required.");
  }

  // Update Drive file content
  await drive.files.update({
    fileId: driveId,
    media: {
      mimeType: "text/markdown",
      body: Buffer.from(newMarkdown, "utf-8"),
    },
  });

  // Update Firestore metadata
  await updateDBText(boardName, textId, {
    title: newTitle,
    lastModifiedDate: new Date().toISOString(),
  });
}