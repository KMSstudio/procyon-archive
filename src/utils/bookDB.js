// AWS SDK v3
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ 
    region: process.env.AWS_REGION,
    credentials: {  
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY 
    }
});
const docClient = DynamoDBDocumentClient.from(client);
const BOOK_TABLE_NAME = "Procyon_Book_DB";
const TAG_TABLE_NAME = "Procyon_Tag_DB";

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

/**
 * Updates Procyon_Tag_DB by adding book ID to existing tags or creating new ones.
 * @param {Array<string>} tags - List of tags to be updated
 * @param {string} bookId - Book ID to add to the tag records
 * @returns {Promise<void>}
 */
export async function updateTagDB(tags, bookId) {
  try {
    for (const tag of tags) {
      const { Item } = await docClient.send(new GetCommand({
        TableName: TAG_TABLE_NAME,
        Key: { tag },
      }));

      if (Item) {
        await docClient.send(new UpdateCommand({
          TableName: TAG_TABLE_NAME,
          Key: { tag },
          UpdateExpression: "SET books = list_append(books, :newBook)",
          ExpressionAttributeValues: { ":newBook": [bookId] },
        }));
      } else {
        await docClient.send(new PutCommand({
          TableName: TAG_TABLE_NAME,
          Item: { tag, books: [bookId] },
        }));
      }
    }
  } catch (error) {
    console.error("Error updating tag database:", error);
    throw error;
  }
}