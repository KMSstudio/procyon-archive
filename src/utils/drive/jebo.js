/* @/utils/drive/jebo.js */

// Google Drive API
import { google } from "googleapis";
// ファイルストリーム
import { Readable } from "stream";
import path from "path";
import fs from "fs";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });
const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_ROOTFOLDER_ID;

/**
 * 指定されたパスに従ってフォルダを作成または検索し、最終フォルダのIDを返す
 * @param {string} folderPath - 例: "stage/報告名"
 * @returns {Promise<string>} - 最終的に作成されたGoogle DriveフォルダID
 */
async function createFolder(folderPath) {
  const folders = folderPath.split("/").map(decodeURIComponent);
  let parentId = ROOT_FOLDER_ID;

  for (const folderName of folders) {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    if (res.data.files.length > 0) {
      parentId = res.data.files[0].id;
    } else {
      const createRes = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
          parents: [parentId],
        },
        fields: "id",
      });
      parentId = createRes.data.id;
    }
  }

  return parentId;
}

/**
 * ファイルをGoogle Driveフォルダにアップロードする
 * @param {string} folderId - アップロード先のフォルダID
 * @param {Object} file - formidableまたはmulterで受け取ったファイルオブジェクト
 */
async function uploadFileToDrive(folderId, file) {
  const fileMeta = {
    name: file.originalFilename || file.originalname || "uploaded",
    parents: [folderId],
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.filepath || file.path),
  };

  const res = await drive.files.create({
    requestBody: fileMeta,
    media,
    fields: "id",
  });

  return res.data.id;
}

/**
 * 文字列からファイルを作成し、Google Driveにアップロードする
 * @param {string} folderId - アップロード先のフォルダID
 * @param {string} filename - ファイル名（例: config.txt）
 * @param {string} content - アップロードするテキスト内容
 */
async function uploadTextAsFile(folderId, filename, content) {
  const stream = Readable.from([content]);

  const res = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [folderId],
    },
    media: {
      mimeType: "text/plain",
      body: stream,
    },
    fields: "id",
  });

  return res.data.id;
}

/**
 * 一括的な通報アップロード処理関数
 * @param {string} reportName - 通報名（例: "山田の通報"）
 * @param {string} description - 通報の説明（config.txtに保存される）
 * @param {Array} files - アップロードするファイル配列（formidable形式）
 * @returns {Promise<string>} - 作成されたフォルダのID
 */
export async function jeboFile(reportName, description, files) {
  if (!reportName || !description || !Array.isArray(files)) { throw new Error("Invalid arguments to jeboFile"); }
  const folderPath = `jebo/${reportName}`;
  const folderId = await createFolder(folderPath);

  // 説明ファイル（config.txt）のアップロード
  await uploadTextAsFile(folderId, "config.txt", description);

  // 各ファイルのアップロード
  for (const file of files) {
    await uploadFileToDrive(folderId, file);
  }

  return folderId;
}