/*
 * @/app/api/drive/export/[fileid]/route.js
*/

// Next Response
import { NextResponse } from "next/server";
// Google Drive API
import { google } from "googleapis";

// Google Drive authentication (Service Account)
const auth = new google.auth.GoogleAuth({
  keyFile: "src/config/service-account.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

// Supported export formats for Google Docs files
const GOOGLE_EXPORT_TYPES = {
  "application/vnd.google-apps.document":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.google-apps.spreadsheet":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.google-apps.presentation":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.google-apps.drawing": "image/svg+xml",
};

/**
 * Handles file export for Google Docs files and direct downloads for regular files.
 */
export async function GET(req, { params }) {
  try {
    const fileId = params.fileid;
    if (!fileId) { return NextResponse.json({ error: "Missing fileId" }, { status: 400 }); }
    const authClient = await auth.getClient();

    // Retrieve file metadata
    const fileMetadata = await drive.files.get({
      fileId,
      fields: "id, name, mimeType",
      auth: authClient,
    });

    // Encode filename for proper handling in HTTP headers
    let { name, mimeType: fileMimeType } = fileMetadata.data;
    const encodedFileName = encodeURIComponent(name)
      .replace(/%20/g, "+")
      .replace(/%22/g, ""); 

    // If the file is a Google Docs format, use the export API
    if (GOOGLE_EXPORT_TYPES[fileMimeType]) {
      const exportMimeType = GOOGLE_EXPORT_TYPES[fileMimeType];

      const response = await drive.files.export(
        { fileId, mimeType: exportMimeType },
        { responseType: "stream", auth: authClient }
      );

      return new Response(response.data, {
        headers: {
          "Content-Disposition": `attachment; filename*=UTF-8''${encodedFileName}.${exportMimeType.split("/")[1]}`,
          "Content-Type": exportMimeType,
        },
      });
    }

    // For regular files, use the direct download API
    const response = await drive.files.get(
      { fileId, alt: "media", acknowledgeAbuse: true },
      { responseType: "stream", auth: authClient }
    );

    return new Response(response.data, {
      headers: {
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFileName}`,
        "Content-Type": fileMimeType,
      },
    });
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}