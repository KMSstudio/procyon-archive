/* @/utils/bookDB.js */

// AWS SDK v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ 
    region: process.env.AWS_PRCY_REGION,
    credentials: {  
        accessKeyId: process.env.AWS_PRCY_ACCESS_KEY,
        secretAccessKey: process.env.AWS_PRCY_SECRET_KEY 
    }
});
const docClient = DynamoDBDocumentClient.from(client);
const BOOK_TABLE_NAME = process.env.AWS_DB_BOOK_TABLE;

// 캐싱 설정
const bookCache = new Map();
const cacheTimestamps = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 60분 (1시간)

/**
 * Retrieves book information from DynamoDB with cache.
 * @param {string} bookId - The ID of the book.
 * @returns {Promise<Object>} - The book data.
 */
export async function getDBBook(bookId) {
  try {
    const now = Date.now();
    if (bookCache.has(bookId) && now - cacheTimestamps.get(bookId) < CACHE_TTL) { return JSON.parse(bookCache.get(bookId)); }
    const { Item: book } = await docClient.send(new GetCommand({
      TableName: BOOK_TABLE_NAME,
      Key: { id: bookId }
    }));
    if (!book) { console.error(`Book with ID ${bookId} not found.`); throw new Error("Book not found"); }
    // Cache Save
    bookCache.set(bookId, JSON.stringify(book));
    cacheTimestamps.set(bookId, now);
    return book;
  } catch (error) {
    console.error("Failed to retrieve book from DynamoDB:", error);
    throw error;
  }
}

/**
 * Retrieves all books from Procyon_Book_DB.
 * @returns {Promise<Array>} - List of all books
 */
export async function getAllDBBooks() {
  try {
    const now = Date.now();
    if (bookCache.has("all_books") && now - cacheTimestamps.get("all_books") < CACHE_TTL) { 
      return JSON.parse(bookCache.get("all_books")); }
    const response = await docClient.send(new ScanCommand({ TableName: BOOK_TABLE_NAME }));
    const books = response.Items || [];
    // Cache Save
    bookCache.set("all_books", JSON.stringify(books));
    cacheTimestamps.set("all_books", now);
    return books;
  } catch (error) {
    console.error("Error retrieving books:", error);
    throw error;
  }
}

/**
 * Creates a new book entry in Procyon_Book_DB and updates cache.
 * @param {Object} bookData - Book information
 * @returns {Promise<void>}
 */
export async function createDBBook(bookData) {
  try {
    await docClient.send(new PutCommand({
      TableName: BOOK_TABLE_NAME,
      Item: bookData,
    }));
    // Cache Save
    bookCache.set(bookData.id, JSON.stringify(bookData));
    cacheTimestamps.set(bookData.id, Date.now());
    bookCache.delete("all_books");
  } catch (error) {
    console.error("Failed to register book:", error);
    throw error;
  }
}

/**
 * Deletes a book from AWS DynamoDB and updates cache.
 * @param {string} bookId - The ID of the book to delete.
 * @returns {Promise<void>}
 */
export async function deleteDBBook(bookId) {
  try {
    await docClient.send(new DeleteCommand({
      TableName: BOOK_TABLE_NAME,
      Key: { id: bookId }
    }));

    console.log(`Deleted book ${bookId} from DynamoDB`);
    // Cache Save
    bookCache.delete(bookId);
    cacheTimestamps.delete(bookId);
    bookCache.delete("all_books");
  } catch (error) {
    console.error(`Failed to delete book ${bookId} from DynamoDB:`, error);
    throw error;
  }
}

/**
 * AWS DynamoDB の本のデータを更新する（cover, content を除く）。
 * @param {string} bookId - 更新する本の ID。
 * @param {Object} updateData - 更新するデータ（cover, content は含めない）。
 * @returns {Promise<void>}
 */
export async function updateDBBook(bookId, updateData) {
  try {
    if (!bookId || typeof updateData !== "object") { 
      throw new Error("Invalid parameters: bookId and updateData must be provided."); }
    // `cover` と `content` フィールドを削除
    const filteredData = { ...updateData };
    delete filteredData.cover;
    delete filteredData.content;
    if (Object.keys(filteredData).length === 0) { 
      console.warn(`No valid fields to update for book ${bookId}`); return; }
    // Create Update Query
    const updateExpression = Object.keys(filteredData)
      .map((key, index) => `#${key} = :val${index}`)
      .join(", ");

    const expressionAttributeNames = Object.keys(filteredData).reduce((acc, key, index) => {
      acc[`#${key}`] = key; 
      return acc;
    }, {});

    const expressionAttributeValues = Object.keys(filteredData).reduce((acc, key, index) => {
      acc[`:val${index}`] = filteredData[key]; 
      return acc;
    }, {});

    // DynamoDB で更新を実行
    await docClient.send(new UpdateCommand({
      TableName: BOOK_TABLE_NAME,
      Key: { id: bookId },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }));

    console.log(`Updated book ${bookId} in DynamoDB`);
    // Cache Set
    bookCache.set(bookId, JSON.stringify({ ...JSON.parse(bookCache.get(bookId) || "{}"), ...filteredData }));
    cacheTimestamps.set(bookId, Date.now());
    bookCache.delete("all_books");
  } catch (error) {
    console.error(`Failed to update book ${bookId} in DynamoDB:`, error);
    throw error;
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