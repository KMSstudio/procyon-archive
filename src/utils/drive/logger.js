/**
 * @/utils/drive/logger.js
 * 
 * This file provides low-level Drive utility functions for the logging system.
 * It supports:
 * - Initialization of the `root/logger` folder on Google Drive
 * - Uploading plain text log files into the folder
 * 
 * Used by: `utils/logger.js` to store hourly and daily log records in Drive.
**/

import { google } from "googleapis";

// Google Drive authentication (Service Account)
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });
let loggerFolderId = null;

/**
 * Initializes the logger folder under the Google Drive root folder.
 * If the "logger" folder already exists, it returns its ID.
 * Otherwise, it creates the folder and returns the newly created ID.
 * 
 * @returns {Promise<string>} - Google Drive folder ID of "logger"
 */
export async function initLoggerFolder() {
  if (loggerFolderId) return loggerFolderId;
  const rootId = process.env.GOOGLE_DRIVE_ROOTFOLDER_ID;
  const query = `'${rootId}' in parents AND name='logger' AND mimeType='application/vnd.google-apps.folder' AND trashed=false`;
  const res = await drive.files.list({
    q: query,
    fields: "files(id, name)"
  });

  if (res.data.files.length > 0) { loggerFolderId = res.data.files[0].id; }
  else {
    const folder = await drive.files.create({
      requestBody: { name: "logger", mimeType: "application/vnd.google-apps.folder", parents: [rootId], },
      fields: "id"
    }); loggerFolderId = folder.data.id;
  }
  return loggerFolderId;
}

/**
 * Uploads a log file to the "logger" folder in Google Drive.
 * The file will be created with the specified filename and content.
 * 
 * @param {string} filename - The name of the log file (e.g., "2025-04-02 06.txt")
 * @param {string} content - The plain text content of the log
 * @returns {Promise<void>}
 */
export async function uploadLogFile(filename, content) {
  const folderId = await initLoggerFolder();

  const fileMetadata = { name: filename, parents: [folderId], };
  const media = { mimeType: "text/plain", body: content, };

  await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id",
  });
}