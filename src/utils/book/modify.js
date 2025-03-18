/* @/utils/book/modify.js */

// Utils
import { updateDBBook } from "@/utils/bookDB";

/**
 * AWS DynamoDB の本のデータを更新する（cover, content を除く）。
 * @param {string} bookId - 更新する本の ID。
 * @param {Object} data - 更新するデータ（cover, content は含めない）。
 * @returns {Promise<void>}
 */
export async function modifyBook(bookId, data) {
  try {
    if (!bookId || !data) {
      throw new Error("Invalid parameters: bookId and data are required.");
    }

    // cover, content フィールドを除外
    const filteredData = { ...data };
    delete filteredData.cover;
    delete filteredData.content;

    // DynamoDB で本のデータを更新
    await updateDBBook(bookId, filteredData);
  } catch (error) {
    console.error("Error modifying book:", error);
    throw error;
  }
}