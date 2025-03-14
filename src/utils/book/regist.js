/* @/utils/book/regist.js */

import { v4 as uuidv4 } from "uuid";
import { createBook, updateTagDB } from "@/utils/bookDB";
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

    // Upload to AWS S3
    const coverExt = bookData.cover.split(".").pop();
    const contentExt = bookData.content.split(".").pop();
    const [coverS3Url, contentS3Url] = await Promise.all([
      copyDriveFile(coverFileId, "cover", `${newId}.${coverExt}`),
      copyDriveFile(contentFileId, "content", `${newId}.${contentExt}`)
    ]);    

    // Store book data in DB
    await Promise.all([
      createBook({
        id: newId,
        title: bookData.title,
        edition: bookData.edition,
        author: bookData.author,
        cover: coverS3Url,
        content: contentS3Url,
        coverFileName: `${newId}.${coverExt}`,
        contentFileName: `${newId}.${contentExt}`,
        tags: bookData.tags,
        mainTags: bookData.mainTags,
        createdAt: new Date().toISOString(),
      }),
      updateTagDB([...bookData.tags, ...bookData.mainTags], newId),
    ]);

    // Move files in Google Drive (async, no need to wait)
    moveDriveFile(coverFileId, `/cover/${newId}.${coverExt}`);
    moveDriveFile(contentFileId, `/content/${newId}.${contentExt}`);

    console.log(`return ${newId}`);
    return newId;
  } catch (error) {
    console.error("Error while registering book:", error);
    throw error;
  }
}