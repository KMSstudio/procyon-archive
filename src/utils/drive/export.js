/*
 * @/utils/drive/export.js
*/

import { google } from "googleapis";

// Google Drive authentication (Service Account)
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

// Supported export formats for Google Docs files
const GOOGLE_EXPORT_TYPES = {
  "application/vnd.google-apps.document": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.google-apps.spreadsheet": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.google-apps.presentation": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.google-apps.drawing": "image/svg+xml",
};

/**
 * Downloads a file from Google Drive.
 * @param {string} fileId - The ID of the file in Google Drive.
 * @returns {Promise<{ stream: any, headers: Object }>} - The file stream and headers.
 */
export async function exportDriveFile(fileId) {
  if (!fileId) throw new Error("Missing fileId");

  const authClient = await auth.getClient();
  const fileMetadata = await drive.files.get({ fileId, fields: "id, name, mimeType, size", auth: authClient });
  let { name, mimeType, size } = fileMetadata.data;
  const encodedFileName = encodeURIComponent(name).replace(/%20/g, "+").replace(/%22/g, "");

  if (GOOGLE_EXPORT_TYPES[mimeType]) {
    const exportMimeType = GOOGLE_EXPORT_TYPES[mimeType];
    const response = await drive.files.export({ fileId, mimeType: exportMimeType }, { responseType: "stream", auth: authClient });

    return {
      stream: response.data,
      headers: {
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFileName}.${exportMimeType.split("/")[1]}`,
        "Content-Type": exportMimeType,
      },
    };
  }

  const response = await drive.files.get({ fileId, alt: "media", acknowledgeAbuse: true }, { responseType: "stream", auth: authClient });

  return {
    stream: response.data,
    headers: {
      "Content-Disposition": `attachment; filename*=UTF-8''${encodedFileName}`,
      "Content-Type": mimeType,
      "Content-Length": size,
      "Transfer-Encoding": "chunked",
    },
  };
}