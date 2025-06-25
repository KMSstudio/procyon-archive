// @/utils/database/textDB.js

import admin from "firebase-admin";

// Initialize Firebase
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Caching
const CACHE_TTL = (process.env.TTL_TEXT_DB).split("*").map(Number).reduce((a, b) => a * b, 1);
const textCache = new Map();
const cacheTimestamps = new Map();

/**
 * @typedef {Object} TextPost
 * @property {string} id - Unique identifier of the post
 * @property {string} title - Post title
 * @property {string} uploaderEmail - Email of the uploader
 * @property {string} uploaderName - Name and info of the uploader
 * @property {string} lastModifyerEmail - Last person who modified the post
 * @property {string} driveId - Google Drive file ID
 * @property {string} createDate - ISO timestamp string
**/

/**
 * Fetch recent posts from a board, ordered by createDate in descending order.
 * Uses caching if within the first 500 items.
 *
 * @param {string} board - Firestore collection name
 * @param {number} [num=40] - Number of posts per page
 * @param {number} [page=1] - Page number (1-based, default=1)
 * @returns {Promise<TextPost[]>} List of recent posts
**/
export async function getRecentDBTexts(board, num = 40, page = 1) {
  const offset = (page - 1) * num;

  const isCacheable = offset + num <= 500;
  const cacheKey = `${board}/_cached/recent500`;
  const now = Date.now();
  // Cache if the page no. <= 500
  if (isCacheable) {
    if (textCache.has(cacheKey) && now - cacheTimestamps.get(cacheKey) < CACHE_TTL) {
      const cached = JSON.parse(textCache.get(cacheKey));
      return cached.slice(offset, offset + num);
    }

    try {
      const snapshot = await db
        .collection(board)
        .orderBy("createDate", "desc")
        .limit(500).get();
      const allTexts = [];
      snapshot.forEach(doc => { allTexts.push({ id: doc.id, ...doc.data() }); });      
      textCache.set(cacheKey, JSON.stringify(allTexts));
      cacheTimestamps.set(cacheKey, now);
      return allTexts.slice(offset, offset + num);
    } catch (error) {
      console.error(`Failed to fetch recent texts from board '${board}' (cached):`, error);
      throw error;
    }
  }
  // Request over 500
  else { 
    try {
      const snapshot = await db
        .collection(board)
        .orderBy("createDate", "desc")
        .offset(offset)
        .limit(num).get();
      const texts = [];
      snapshot.forEach(doc => { texts.push({ id: doc.id, ...doc.data() }); });
      return texts;
    }
    catch (error) { throw error; }
  }
}

/**
 * Fetch a single post document from Firestore by board and text ID.
 *
 * @param {string} board - Board name (used as Firestore collection)
 * @param {string} textId - Document ID (text ID)
 * @returns {Promise<Object|null>} - Post object with data, or null if not found
 */
export async function getDBText(board, textId) {
  const cacheKey = `${board}/${textId}`;
  const now = Date.now();

  if (textCache.has(cacheKey) && now - cacheTimestamps.get(cacheKey) < CACHE_TTL) {
    return JSON.parse(textCache.get(cacheKey));
  }

  try {
    const docRef = db.collection(board).doc(textId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) return null;

    const data = { id: docSnap.id, ...docSnap.data() };
    textCache.set(cacheKey, JSON.stringify(data));
    cacheTimestamps.set(cacheKey, now);
    return data;
  } catch (error) {
    console.error(`Failed to fetch text '${textId}' from board '${board}':`, error);
    throw error;
  }
}

/**
 * Create a new post in the specified board collection.
 * The textData object must contain a unique 'id' field.
 *
 * @param {string} board - Board name (used as Firestore collection)
 * @param {Object} textData - Post data (must include 'id' field)
 */
export async function createDBText(board, textData) {
  try {
    if (!textData.id) throw new Error("textData.id is required");
    await db.collection(board).doc(textData.id).set(textData);

    const now = Date.now();
    const singleKey = `${board}/${textData.id}`;
    const recentKey = `${board}/_cached/recent500`;
    // Update single cache
    textCache.set(singleKey, JSON.stringify(textData));
    cacheTimestamps.set(singleKey, now);
    // Update recent cache;
    if (textCache.has(recentKey)) {
      const cached = JSON.parse(textCache.get(recentKey));
      const updated = [textData, ...cached].slice(0, 500);
      textCache.set(recentKey, JSON.stringify(updated));
      cacheTimestamps.set(recentKey, now);
    }
  } catch (error) {
    console.error(`Failed to create text in board '${board}':`, error);
    throw error;
  }
}

/**
 * Delete a post from a board by ID.
 *
 * @param {string} board - Board name
 * @param {string} textId - ID of the text document to delete
 */
export async function deleteDBText(board, textId) {
  try {
    await db.collection(board).doc(textId).delete();

    textCache.delete(`${board}/${textId}`);
    cacheTimestamps.delete(`${board}/${textId}`);
    textCache.delete(`${board}/recent/1`);
  } catch (error) {
    console.error(`Failed to delete text '${textId}' from board '${board}':`, error);
    throw error;
  }
}

/**
 * Update specific fields of a post in a board.
 *
 * @param {string} board - Board name
 * @param {string} textId - ID of the text document to update
 * @param {Object} updateData - Key-value pairs to update
 */
export async function updateDBText(board, textId, updateData) {
  try {
    await db.collection(`${board}`).doc(textId).update(updateData);

    const cacheKey = `${board}/${textId}`;
    const cached = JSON.parse(textCache.get(cacheKey) || "{}");
    const updated = { ...cached, ...updateData };

    textCache.set(cacheKey, JSON.stringify(updated));
    cacheTimestamps.set(cacheKey, Date.now());
    textCache.delete(`${board}/recent/1`);
  } catch (error) {
    console.error(`Failed to update text '${textId}' in board '${board}':`, error);
    throw error;
  }
}