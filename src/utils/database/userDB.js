/* @/utils/database/userDB.js */

import admin from "firebase-admin";

// Initialize Firebase
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const userCollection = db.collection(process.env.FIRE_DB_USER_TABLE);

// Caching
let userCache = new Map(), cacheTimestamps = new Map();
const CACHE_TTL = (process.env.TTL_USER_DB).split('*').map(Number).reduce((acc, val) => acc * val, 1);

/**
 * Fetch user from Firestore (cache applied)
 */
export async function fetchUser(email) {
  const now = Date.now();
  if (userCache.has(email) && now - cacheTimestamps.get(email) < CACHE_TTL) return userCache.get(email);

  try {
    const doc = await userCollection.doc(email).get();
    if (!doc.exists) return null;
    const data = doc.data();
    userCache.set(email, data);
    cacheTimestamps.set(email, now);
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error(`Error fetching user ${email}:`, error);
    throw error;
  }
}

/**
 * Check if user exists in Firestore (cache applied)
 */
export async function isUserExist(email) {
  if (!email) return false;
  const user = await fetchUser(email);
  return user !== null;
}

/**
 * Save user to Firestore (cache applied)
 */
export async function saveUser(email, data) {
  if (!email || !data) return;
  function cleanText(str) {
    if (str === undefined || str === null) return "";
    return typeof str === "string" ? str.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").trim() : str; }
  const cleanedData = {};
  for (const key in data) { cleanedData[key] = cleanText(data[key]); }

  // console.log(`userCache: ${JSON.stringify(userCache.get(email))}`);
  // console.log(`data: ${JSON.stringify(cleanedData)}`);
  if (JSON.stringify(userCache.get(email)) === JSON.stringify(cleanedData)) { return; }

  try {
    await userCollection.doc(email).set(cleanedData, { merge: true });
    userCache.set(email, cleanedData);
    cacheTimestamps.set(email, Date.now());
  } catch (error) {
    console.error(`Error saving user ${email}:`, error);
    throw error;
  }
}  

/**
 * Update last access date & store basic user info if given
 */
export async function updateUserAccess(email, data = {}) {
  if (!email) return;

  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 13);
  const user = await fetchUser(email);

  if (!user) {
    await saveUser(email, { lastAccessDate: today, lastContributionDate: today, isAdmin: false, isPrestige:false, ...data });
  } else {
    let updated = false;
    if (user.lastAccessDate !== today) {
      user.lastAccessDate = today;
      updated = true;
    }
    for (const key of ['studentName', 'studentPosition', 'studentMajor']) {
      if (data[key] && user[key] !== data[key]) {
        user[key] = data[key];
        updated = true;
      }
    }
    if (updated) await saveUser(email, user);
  }
}

/**
 * Update last access date
 */
export async function updateUserAccessDate(email) {
  if (!email) return;

  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().replace('T', ' ').slice(0, 13);
  const user = await fetchUser(email);

  if (!user) { await saveUser(email, { lastAccessDate: today, lastContributionDate: today, isAdmin: false, ...data }); }
  else if (user.lastAccessDate !== today) { user.lastAccessDate = today; await saveUser(email, user); }
}

/**
 * Fetch all users from Firestore (cache applied)
 */
export async function fetchAllUser() {
  const now = Date.now();
  if (userCache.has("all_users") && now - cacheTimestamps.get("all_users") < CACHE_TTL) {
    return userCache.get("all_users");
  }

  try {
    const snapshot = await userCollection.get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ email: doc.id, ...doc.data() });
    });

    userCache.set("all_users", users);
    cacheTimestamps.set("all_users", now);
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}