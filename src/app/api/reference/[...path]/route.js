import { google } from "googleapis";
import { NextResponse } from "next/server";

// Service account authentication
const auth = new google.auth.GoogleAuth({
  keyFile: "src/config/service-account.json", // Path to service account JSON
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
const drive = google.drive({ version: "v3", auth });

// Root folder ID in Google Drive (procyon/data/reference)
const ROOT_FOLDER_ID = "1_FuuLHZmAl60LxJdQGin8t3595OCsxu-";

/**
 * Retrieves the folder ID for a given path in Google Drive.
 * @param {string} folderPath - The path of the folder (e.g., 'folder1/folder2')
 * @returns {Promise<string|null>} - The folder ID if found, otherwise null
 */
async function getFolderId(folderPath) {
  try {
    if (!folderPath || folderPath.trim() === "") return null;

    const folders = folderPath.split("/");
    let parentId = ROOT_FOLDER_ID;
    

    for (const folder of folders) {
      if (!folder) continue;
      const query = `'${parentId}' in parents AND name='${folder}' AND mimeType='application/vnd.google-apps.folder' AND trashed=false`;
      
      try {
        const res = await drive.files.list({
          q: query,
          fields: "files(id, name)",
        });
        if (!res.data.files || res.data.files.length === 0) return null;
        parentId = res.data.files[0].id;
      } catch (apiError) {
        console.error(`Google Drive API error: ${apiError.message}`);
        return null;
      }
    }

    return parentId;
  } catch (error) {
    console.error(`Error in getFolderId: ${error.message}`);
    return null;
  }
}

/**
 * Handles GET requests to retrieve a list of files within a Google Drive folder.
 * @param {Request} req - The request object
 * @param {Object} params - Request parameters
 * @returns {Promise<Response>} - JSON response with file details or an error message
 */
export async function GET(req, { params }) {
  try {
    const folderPath = params.path.join("/");
    const folderId = await getFolderId(folderPath);
    if (!folderId) { return NextResponse.json({ error: "Folder not found." }, { status: 404 }); }

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType, webViewLink, webContentLink, exportLinks)",
    });

    const files = response.data.files.map((file) => {
      return {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        downloadLink: `/api/drive/export/${file.id}`,
      };
    });    
    
    console.log(files)
    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    console.error(`Error in GET request: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
