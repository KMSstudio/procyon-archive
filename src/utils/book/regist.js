import { v4 as uuidv4 } from "uuid";
import { getAllBooks, createBook, updateTagDB } from "@/utils/bookDB";
import { moveDriveFile, copyDriveFile, getDriveFileId } from "@/utils/book/driveUtils";

export async function registerBook(bookData) {
  try {
    const books = await getAllBooks();
    let newId = uuidv4().replace(/-/g, "").substring(0, 12);
    while (books.some(book => book.id === newId)) newId = uuidv4().replace(/-/g, "").substring(0, 12);

    const coverFileId = await getDriveFileId(`/stage/${bookData.cover}`);
    const contentFileId = await getDriveFileId(`/stage/${bookData.content}`);
    if (!coverFileId || !contentFileId) throw new Error("File not found in Google Drive.");

    const coverExt = bookData.cover.split(".").pop();
    const contentExt = bookData.content.split(".").pop();

    const newCoverFileId = await moveDriveFile(coverFileId, `/cover/${newId}.${coverExt}`);
    const newContentFileId = await moveDriveFile(contentFileId, `/content/${newId}.${contentExt}`);
    await copyDriveFile(newCoverFileId, `${newId}.${coverExt}`);

    const mainTags = bookData.mainTags.map(tag => tag.name)
    await createBook({
      id: newId,
      title: bookData.title,
      edition: bookData.edition,
      author: bookData.author,
      cover: `https://drive.google.com/uc?id=${newCoverFileId}`,
      content: `https://drive.google.com/uc?id=${newContentFileId}`,
      tags: bookData.tags,
      mainTags: mainTags,
      createdAt: new Date().toISOString(),
    });

    await updateTagDB([...bookData.tags, ...mainTags], newId);

    return { success: true, id: newId };
  } catch (error) {
    console.error("Error while registering book:", error);
    return { success: false, error: error.message };
  }
}