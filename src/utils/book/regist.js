/* @/utils/book/regist.js */

import { v4 as uuidv4 } from "uuid";
import { createBook } from "@/utils/bookDB";
import { moveDriveFile, copyDriveFile, getDriveFileId } from "@/utils/book/driveUtils";

export async function registerBook(bookData) {
  try {
    let newId = uuidv4().replace(/-/g, "").substring(0, 12);

    // Get Google Drive File Ids
    const [coverFileId, contentFileId] = await Promise.all([
      getDriveFileId(`/stage/${bookData.cover}`),
      getDriveFileId(`/stage/${bookData.content}`),
    ]);
    if (!coverFileId || !contentFileId) {
      throw new Error(`File not found in Google Drive: /stage/${bookData.cover} || /stage/${bookData.content}`); }
    const coverExt = bookData.cover.split(".").pop();
    const contentExt = bookData.content.split(".").pop();

    // Define contentUrl promise
    const contentUrlPromise = contentExt === "pdf"
      ? moveDriveFile(contentFileId, `/content/${newId}.${contentExt}`).then(() => 
          `https://drive.google.com/file/d/${contentFileId}/view`)
      : copyDriveFile(contentFileId, "content", `${newId}.${contentExt}`);
    const [coverS3Url, contentUrl] = await Promise.all([
      copyDriveFile(coverFileId, "cover", `${newId}.${coverExt}`),
      contentUrlPromise,
    ]);

    // Store book data in DB
    await createBook({
      id: newId,
      title: bookData.title,
      edition: bookData.edition,
      author: bookData.author,
      cover: coverS3Url,
      content: contentUrl,
      coverFileName: `${newId}.${coverExt}`,
      contentFileName: `${newId}.${contentExt}`,
      tags: bookData.tags,
      mainTags: bookData.mainTags,
      createdAt: new Date().toISOString(),
    });

    // Move cover file in Google Drive
    await moveDriveFile(coverFileId, `/cover/${newId}.${coverExt}`);

    console.log(`return ${newId}`);
    return newId;
  } catch (error) {
    console.error("Error while registering book:", error);
    throw error;
  }
}