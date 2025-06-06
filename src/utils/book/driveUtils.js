/* @/utils/book/driveUtils.js */

import fs from "fs";
import path from "path";
import { google } from "googleapis";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import mime from "mime-types";

// Google Drive API
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });
const BOOK_FOLDER_ID = process.env.GOOGLE_DRIVE_BOOKFOLDER_ID;

// AWS S3 API
const TEMP_STORAGE_PATH = "/tmp";
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
    const tempFilePath = path.join(TEMP_STORAGE_PATH, fileName);
    await fs.promises.mkdir(TEMP_STORAGE_PATH, { recursive: true });

    const response = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });

    if (!response || !response.data) {
      throw new Error(`Failed to fetch file from Google Drive: ${fileId}`);
    }

    const fileStream = fs.createWriteStream(tempFilePath);
    response.data.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on("finish", resolve);
      fileStream.on("error", reject);
    });

    const fileBuffer = await fs.promises.readFile(tempFilePath);
    const mimeType = mime.lookup(fileName) || "image/png";
    
    const s3Key = `${folder}/${fileName}`;

    await s3.send(new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read",
    }));

    await fs.promises.unlink(tempFilePath); // Ensures temp file is deleted

    return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
  } catch (error) {
    console.error(`Failed to copy Google Drive file and upload to S3: ${fileId} → ${folder}/${fileName}`, error);
    throw error;
  }
}

/**
 * Move Google Drive to Trashcan
 * @param {string} fileUrl - Google Drive File URL.
 * @returns {Promise<void>}
 */
export async function deleteDriveFile(fileUrl) {
  try {
    const fileIdMatch = fileUrl.match(/[-\w]{25,}/);
    const fileId = fileIdMatch ? fileIdMatch[0] : null;
    if (!fileId) { console.warn(`Invalid Google Drive URL: ${fileUrl}`); return; }

    // Move to trashcan
    await drive.files.update({
      fileId,
      requestBody: {
        trashed: true,
      },
    });
  } catch (error) {
    console.error("Failed to move file to trash on Google Drive:", error);
  }
}

/**
 * Deletes a file from AWS S3.
 * @param {string} fileUrl - The AWS S3 file URL.
 * @returns {Promise<void>}
 */
export async function deleteS3File(fileUrl) {
  try {
    const key = fileUrl.split(`${S3_BUCKET_NAME}/`)[1];
    if (!key) { console.warn(`Invalid S3 URL: ${fileUrl}`); return; }

    await s3Client.send(new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    }));
    console.log(`Deleted S3 file: ${key}`);
  } catch (error) {
    console.error("Failed to delete file from S3:", error);
  }
}