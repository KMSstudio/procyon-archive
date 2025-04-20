// @/utils/drive/text.js

import { google } from "googleapis";

// Google Drive 인증
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });
const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOTFOLDER_ID;

/**
 * Fetches the plain text content of a file from Google Drive using its file ID.
 * The file must be a plain text file (e.g., .md, .txt). Binary formats like PDF or DOCX will not work properly.
 *
 * @param {string} fileId - The ID of the file stored on Google Drive.
 * @returns {Promise<string|null>} - The plain text content of the file, or null if reading fails.
 */
export async function getDriveText(fileId) {
  try {
    const res = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "text" }
    );
    console.log(fileId);
    return res.data;
  } catch (err) {
    console.error("Failed to read file from Google Drive:", err.message);
    return null;
  }
}

/**
 * Returns the Google Drive folder ID from a given path.
 *
 * @param {string} path - The folder path (e.g., "text/notice")
 * @returns {Promise<string>} - The folder's Google Drive ID
 */
export async function getDriveId(path) {
  const segments = path.split("/").filter(Boolean);
  let parentId = ROOT_FOLDER_ID;

  for (const folder of segments) {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and name='${folder}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id)",
    });
    if (!res.data.files.length) { throw new Error(`Folder "${folder}" not found under ${parentId}`); }
    parentId = res.data.files[0].id;
  }

  return parentId;
}

/**
 * Uploads a plain text file to Google Drive under the given folder path.
 *
 * @param {string} path - Folder path (e.g., "text/notice")
 * @param {string} filename - Name of the file to upload (e.g., "abc123.md")
 * @param {string} content - Text content to upload
 * @returns {Promise<string>} - The uploaded file's Drive ID
 */
export async function putDriveText(path, filename, content) {
  try {
    const folderId = await getDriveId(path);
    const fileMetadata = { name: filename, parents: [folderId] };
    const media = { mimeType: "text/plain", body: content };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });

    return file.data.id;
  } catch (err) {
    console.error("putDriveText error:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Updates the markdown content of an existing file in Google Drive.
 * @param {string} fileId - The file ID in Google Drive.
 * @param {string} newContent - The new markdown content.
 * @returns {Promise<void>}
 */
export async function updateDriveText(fileId, newContent) {
  try {
    await drive.files.update({
      fileId,
      media: {
        mimeType: "text/markdown",
        body: Buffer.from(newContent, "utf-8"),
      },
    });
  } catch (err) {
    console.error("updateDriveText error:", err.message);
    throw err;
  }
}