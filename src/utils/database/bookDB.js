/* @/utils/database/bookDB.js */

import admin from "firebase-admin";

// Initialize Firebase
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const bookCollection = db.collection(process.env.AWS_DB_BOOK_TABLE);

// Cache and TTL settings
let bookCache = new Map(), cacheTimestamps = new Map();
const CACHE_TTL = (process.env.TTL_BOOK_DB).split("*").map(Number).reduce((a, b) => a * b, 1);

/**
 * Retrieve a book by ID (with caching)
 * @param {string} bookId - ID of the book
 * @returns {Promise<Object>} - Book data
 */
export async function getDBBook(bookId) {
  try {
    const now = Date.now();
    if (bookCache.has(bookId) && now - cacheTimestamps.get(bookId) < CACHE_TTL) {
      return JSON.parse(bookCache.get(bookId));
    }

    const doc = await bookCollection.doc(bookId).get();
    if (!doc.exists) {
      console.error(`Book with ID ${bookId} not found.`);
      throw new Error("Book not found");
    }

    const book = doc.data();
    bookCache.set(bookId, JSON.stringify(book));
    cacheTimestamps.set(bookId, now);
    return book;
  } catch (error) {
    console.error("Failed to retrieve book from Firestore:", error);
    throw error;
  }
}

/**
 * Retrieve all books from the collection (with caching)
 * @returns {Promise<Array>} - List of all book objects
 */
export async function getAllDBBooks() {
  try {
    const now = Date.now();
    if (bookCache.has("all_books") && now - cacheTimestamps.get("all_books") < CACHE_TTL) {
      return JSON.parse(bookCache.get("all_books"));
    }

    const snapshot = await bookCollection.get();
    const books = [];
    snapshot.forEach(doc => {
      books.push({ id: doc.id, ...doc.data() });
    });

    bookCache.set("all_books", JSON.stringify(books));
    cacheTimestamps.set("all_books", now);
    return books;
  } catch (error) {
    console.error("Error retrieving books:", error);
    throw error;
  }
}

/**
 * Create a new book entry in Firestore
 * @param {Object} bookData - The book object to create (must contain `id`)
 */
export async function createDBBook(bookData) {
  try {
    if (!bookData.id) throw new Error("bookData.id is required");
    await bookCollection.doc(bookData.id).set(bookData);
    bookCache.set(bookData.id, JSON.stringify(bookData));
    cacheTimestamps.set(bookData.id, Date.now());
    bookCache.delete("all_books");
  } catch (error) {
    console.error("Failed to register book:", error);
    throw error;
  }
}

/**
 * Update book data in Firestore (excluding cover and content fields)
 * @param {string} bookId - ID of the book to update
 * @param {Object} updateData - Fields to update
 */
export async function updateDBBook(bookId, updateData) {
  try {
    if (!bookId || typeof updateData !== "object") { throw new Error("Invalid parameters: bookId and updateData must be provided."); }
    const filteredData = { ...updateData };
    delete filteredData.cover;
    delete filteredData.content;
    if (Object.keys(filteredData).length === 0) { console.warn(`No valid fields to update for book ${bookId}`); return; }

    await bookCollection.doc(bookId).update(filteredData);
    const cached = JSON.parse(bookCache.get(bookId) || "{}");
    bookCache.set(bookId, JSON.stringify({ ...cached, ...filteredData }));
    cacheTimestamps.set(bookId, Date.now());
    bookCache.delete("all_books");

    console.log(`Updated book ${bookId} in Firestore`);
  } catch (error) {
    console.error(`Failed to update book ${bookId} in Firestore:`, error);
    throw error;
  }
}

/**
 * Delete a book from Firestore and clear it from the cache
 * @param {string} bookId - ID of the book to delete
 */
export async function deleteDBBook(bookId) {
  try {
    await bookCollection.doc(bookId).delete();
    bookCache.delete(bookId);
    cacheTimestamps.delete(bookId);
    bookCache.delete("all_books");
    console.log(`Deleted book ${bookId} from Firestore`);
  } catch (error) {
    console.error(`Failed to delete book ${bookId} from Firestore:`, error);
    throw error;
  }
}