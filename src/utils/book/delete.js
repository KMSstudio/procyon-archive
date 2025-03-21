/* @/utils/book/delete.js */

// Utils
import { getDBBook, deleteDBBook, deleteS3File } from "@/utils/database/bookDB";
import { deleteDriveFile } from "@/utils/book/driveUtils";

/**
 * AWS DynamoDB から本のデータを削除し、関連するファイルを AWS S3 または Google Drive から削除する。
 * @param {string} bookId - 削除する本の ID。
 * @returns {Promise<void>}
 */
export async function deleteBook(bookId) {
  try {
    // 本の情報を取得する（DynamoDB から取得）
    const book = await getDBBook(bookId);
    console.log(`delete if ${bookId}`);
    if (!book) { throw new Error(`Book with ID ${bookId} not found.`); }
    const { cover, content } = book;
    // AWS DynamoDB から本のデータを削除（bookDB.js の deleteDBBook を使用）
    await deleteDBBook(bookId);
    // コンテンツファイルを削除（Google Drive または AWS S3）
    if (content) {
      content.startsWith("https://drive.google.com/")
        ? await deleteDriveFile(content)
        : await deleteS3File(content);
    }
    // カバー画像を削除（AWS S3）
    if (cover?.startsWith("https://s3.amazonaws.com/")) { await deleteS3File(cover); }
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}