// @/utils/text/modify.js

import { updateDBText, getDBText } from "@/utils/database/textDB";
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
 * @param {string} boardName - Board name (Firestore collection)
 * @param {string} textId - Firestore document ID
 * @param {string} [newTitle] - Optional new title
 * @param {string} [newMarkdown] - Optional new markdown content
 */
export async function modifyText(boardName, textId, newTitle, newMarkdown) {
  if (!boardName || !textId) { throw new Error("boardName and textId are required."); }
  const doc = await getDBText(boardName, textId);
  if (!doc || !doc.driveId) { throw new Error("Cannot find document or driveId."); }
  const driveId = doc.driveId;

  if (newMarkdown !== undefined) {
    await drive.files.update({
      fileId: driveId,
      media: {
        mimeType: "text/markdown",
        body: Buffer.from(newMarkdown, "utf-8"),
      },
    });
  }

  if (newTitle !== undefined) {
    await updateDBText(boardName, textId, {
      title: newTitle,
      lastModifiedDate: new Date().toISOString(),
    });
  }
}