import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";

// Google Arive API
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });
const BOOK_FOLDER_ID = process.env.GOOGLE_DRIVE_BOOKFOLDER_ID;

// AWS S3 API
const LOCAL_COVER_PATH = path.resolve("./temp");
const S3_BUCKET_NAME = process.env.AWS_S3_BOOKCOVER_BUCKET;
const s3 = new S3Client({ 
  region: process.env.AWS_PRCY_REGION,
  credentials: {  
      accessKeyId: process.env.AWS_PRCY_ACCESS_KEY,
      secretAccessKey: process.env.AWS_PRCY_SECRET_KEY 
  }
});

/**
 * Retrieves a file or folder ID from Google Drive based on a relative path.
 * @param {string} filePath - Relative path from the book folder (e.g., "/stage/file.pdf")
 * @returns {Promise<string|null>} - File ID if found, otherwise null
 */
export async function getDriveFileId(filePath) {
  try {
    if (!filePath.startsWith("/")) throw new Error("Path must start with '/'");
    const folders = filePath.split("/").filter(part => part !== "");
    let parentId = BOOK_FOLDER_ID;

    for (const folder of folders) {
      const response = await drive.files.list({
        q: `'${parentId}' in parents and name='${folder}' and trashed=false`,
        fields: "files(id, name, mimeType)",
      });
      if (response.data.files.length === 0) return null;
      const file = response.data.files[0];
      parentId = file.id;
      if (folder === folders[folders.length - 1]) return file.id;
    }

    return null;
  } catch (error) {
    console.error(`Failed to retrieve file from Google Drive: ${filePath}`);
    return null;
  }
}

/**
 * Moves a file within Google Drive.
 * @param {string} fileId - File ID
 * @param {string} targetPath - Destination path (e.g., "/cover/{newFileName}")
 * @returns {Promise<string>} - New file ID
 */
export async function moveDriveFile(fileId, targetPath) {
  try {
    if (!targetPath.startsWith("/")) throw new Error("Path must start with '/'");
    const folders = targetPath.split("/").filter(part => part !== "");
    const newFolderId = await getDriveFileId(`/${folders.slice(0, -1).join("/")}`);
    if (!newFolderId) throw new Error(`Destination folder not found: ${targetPath}`);
    const newFileName = folders[folders.length - 1];

    const file = await drive.files.get({ fileId, fields: "parents" });
    const previousParents = file.data.parents.join(",");

    const updatedFile = await drive.files.update({
      fileId,
      addParents: newFolderId,
      removeParents: previousParents,
      fields: "id",
    });

    await drive.files.update({ fileId: updatedFile.data.id, resource: { name: newFileName } });

    return updatedFile.data.id;
  } catch (error) {
    console.error(`Failed to move file: ${fileId} → ${targetPath}`, error);
    throw error;
  }
}

/**
 * Copies a file from Google Drive and saves it to AWS S3 in the correct folder.
 * @param {string} fileId - Google Drive file ID
 * @param {string} folder - Target folder in S3 ("cover" or "content")
 * @param {string} fileName - Target file name (e.g., "123abc.png")
 * @returns {Promise<string>} - S3 URL of the uploaded file
 */
export async function copyDriveFile(fileId, folder, fileName) {
  try {
    const tempFilePath = path.join(LOCAL_COVER_PATH, fileName);
    await fs.promises.mkdir(LOCAL_COVER_PATH, { recursive: true });

    const response = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });
    const fileStream = fs.createWriteStream(tempFilePath);

    response.data.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
    });

    const fileBuffer = await fs.promises.readFile(tempFilePath);
    const mimeType = mime.lookup(fileName) || "image/png";
    
    const s3Key = `${folder}/${fileName}`; // Stores file in the correct S3 folder

    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read",
    }));

    await fs.promises.unlink(tempFilePath);

    return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
  } catch (error) {
    console.error(`Failed to copy Google Drive file and upload to S3: ${fileId} → ${folder}/${fileName}`, error);
    throw error;
  }
}