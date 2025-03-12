/*
*   @/utils/book/regist.js
*/

import { v4 as uuidv4 } from "uuid";
import { createBook, updateTagDB } from "@/utils/bookDB";
import { moveDriveFile, copyDriveFile, getDriveFileId } from "@/utils/book/driveUtils";

export async function registerBook(bookData) {
  try {
    let newId = uuidv4().replace(/-/g, "").substring(0, 12);
    // Get Google Drive File Id
    const [coverFileId, contentFileId] = await Promise.all([
      getDriveFileId(`/stage/${bookData.cover}`),
      getDriveFileId(`/stage/${bookData.content}`),
    ]);
    
    if (!coverFileId || !contentFileId) throw new Error(`File not found in Google Drive: /stage/${bookData.cover} || /stage/${bookData.content}`);

    // Move File to /cover, /content
    const coverExt = bookData.cover.split(".").pop();
    const contentExt = bookData.content.split(".").pop();
    const [newCoverFileId, newContentFileId] = await Promise.all([
      moveDriveFile(coverFileId, `/cover/${newId}.${coverExt}`),
      moveDriveFile(contentFileId, `/content/${newId}.${contentExt}`),
    ]);

    // Copy Drive File to AWS S3, Update Book DB, Update Tag Db
    await Promise.all([
      copyDriveFile(newCoverFileId, `${newId}.${coverExt}`),
      createBook({
        id: newId,
        title: bookData.title,
        edition: bookData.edition,
        author: bookData.author,
        cover: `https://drive.google.com/uc?id=${newCoverFileId}`,
        content: `https://drive.google.com/uc?id=${newContentFileId}`,
        tags: bookData.tags,
        mainTags: bookData.mainTags.map(tag => tag.name),
        createdAt: new Date().toISOString(),
      }),
      updateTagDB([...bookData.tags, ...bookData.mainTags.map(tag => tag.name)], newId),
    ]);

    return { success: true, id: newId };
  } catch (error) {
    console.error("Error while registering book:", error);
    return { success: false, error: error.message };
  }
}