/* @/utils/bookDB.js */

// AWS SDK v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

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
 * Retrieves all books from Procyon_Book_DB.
 * @returns {Promise<Array>} - List of all books
 */
export async function getAllBooks() {
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
export async function createBook(bookData) {
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