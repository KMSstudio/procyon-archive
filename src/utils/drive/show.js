// @/utils/gdrive/show.js

// Google Drive API
import { google } from "googleapis";
// Constant
import extLists from "@/config/extLists.json";

// サ一ビスアカウント認証
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

// ル一トフォルダID (Google Driveのル一トフォルダ)
const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOTFOLDER_ID;

/**
 * 指定されたGoogle Driveフォルダのファイルリストを取得する関数
 * @param {string} folderPath - 例: 'folder1/folder2'
 * @returns {Promise<Array>} - ファイルリスト（オブジェクトの配列）
 */
export async function getDriveFiles(folderPath) {
  try {
    if (!folderPath || folderPath.trim() === "") return [];

    const folders = folderPath.split("/").map(decodeURIComponent);
    let parentId = ROOT_FOLDER_ID;

    // 指定されたパスのフォルダIDを検索
    for (const folder of folders) {
      if (!folder) continue;
      const query = `'${parentId}' in parents AND name='${folder}' AND mimeType='application/vnd.google-apps.folder' AND trashed=false`;

      try {
        const res = await drive.files.list({
          q: query,
          fields: "files(id, name)",
        });

        if (!res.data.files || res.data.files.length === 0) return [];
        parentId = res.data.files[0].id;
      } catch (apiError) {
        console.error(`Google Drive API エラー: ${apiError.message}`);
        return [];
      }
    }

    // フォルダ內のファイルリストを取得
    const response = await drive.files.list({
      q: `'${parentId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType)",
    });

    const result = response.data.files.map((file) => {
      const isFolder = file.mimeType === "application/vnd.google-apps.folder";
      const ext = isFolder
        ? "&folder"
        : file.name.includes(".")
        ? file.name.split(".").pop()
        : "";
    
      return {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        isFolder,
        ext,
        downloadLink: isFolder
          ? `/drive/${folderPath}/${file.name}`
          : `/api/drive/export/${file.id}`,
        img: isFolder ? "/image/ico/folder.png" : extLists[ext] || "/image/ico/file.png",
      };
    });

    // 名前順に、そしてフォルダがファイルより前に来るようにソート
    result.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
    });
    return result;
  } catch (error) {
    console.error(`getDriveFiles エラ一: ${error.message}`);
    return [];
  }
}