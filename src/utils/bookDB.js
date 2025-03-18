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
const BOOK_TABLE_NAME = "Procyon_Book_DB";

/**
 * Retrieves book information from DynamoDB.
 * @param {string} bookId - The ID of the book.
 * @returns {Promise<Object>} - The book data.
 */
export async function getDBBook(bookId) {
  try {
    const { Item: book } = await docClient.send(new GetCommand({
      TableName: BOOK_TABLE_NAME,
      Key: { id: bookId }
    }));
    if (!book) { console.error(`Book with ID ${bookId} not found.`); throw new Error("Book not found"); }
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
    const response = await docClient.send(new ScanCommand({ TableName: BOOK_TABLE_NAME }));
    return response.Items || [];
  } catch (error) {
    console.error("Error retrieving books:", error);
    throw error;
  }
}

/**
 * Creates a new book entry in Procyon_Book_DB.
 * @param {Object} bookData - Book information
 * @returns {Promise<void>}
 */
export async function createDBBook(bookData) {
  try {
    await docClient.send(new PutCommand({
      TableName: BOOK_TABLE_NAME,
      Item: bookData,
    }));
  } catch (error) {
    console.error("Failed to register book:", error);
    throw error;
  }
}

/**
 * AWS DynamoDB から本のデータを削除する。
 * @param {string} bookId - 削除する本の ID。
 * @returns {Promise<void>}
 */
export async function deleteDBBook(bookId) {
  try {
    await docClient.send(new DeleteCommand({
      TableName: BOOK_TABLE_NAME,
      Key: { id: bookId }
    }));
    console.log(`Deleted book ${bookId} from DynamoDB`);
  } catch (error) {
    console.error(`Failed to delete book ${bookId} from DynamoDB:`, error);
    throw error;
  }
}

/**
 * Updates an existing book entry in Procyon_Book_DB.
 * @param {string} bookId - ID of the book to update
 * @param {Object} updateData - Updated book data
 * @returns {Promise<void>}
 */
export async function updateBook(bookId, updateData) {
  try {
    const updateExpression = Object.keys(updateData)
      .map((key, index) => `#${key} = :val${index}`)
      .join(", ");
    
    const expressionAttributeNames = Object.keys(updateData).reduce((acc, key, index) => {
      acc[`#${key}`] = key;
      return acc;
    }, {});

    const expressionAttributeValues = Object.keys(updateData).reduce((acc, key, index) => {
      acc[`:val${index}`] = updateData[key];
      return acc;
    }, {});

    await docClient.send(new UpdateCommand({
      TableName: BOOK_TABLE_NAME,
      Key: { id: bookId },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }));
  } catch (error) {
    console.error("Failed to update book:", error);
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
      throw new Error("Invalid parameters: bookId and updateData must be provided."); 
    }

    // `cover` と `content` フィールドを削除
    const filteredData = { ...updateData };
    delete filteredData.cover;
    delete filteredData.content;
    if (Object.keys(filteredData).length === 0) { console.warn(`No valid fields to update for book ${bookId}`); return; }

    // 更新対象のフィールドを動的に構成
    const updateExpression = Object.keys(updateData)
      .map((key, index) => `#${key} = :val${index}`)
      .join(", ");

    const expressionAttributeNames = Object.keys(updateData).reduce((acc, key, index) => {
      acc[`#${key}`] = key; return acc;
    }, {});
    const expressionAttributeValues = Object.keys(updateData).reduce((acc, key, index) => {
      acc[`:val${index}`] = updateData[key]; return acc;
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