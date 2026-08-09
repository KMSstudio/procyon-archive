/* @/utils/database/userDB.js */

import { db } from "@/utils/firebase";
const userCollection = db.collection(process.env.FIRE_DB_USER_TABLE);

function getKoreanHourString() {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 13);
}

function cleanText(value) {
  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, "").trim() : value;
}

function cleanUserData(data) {
  const cleanedData = {};
  for (const key in data) cleanedData[key] = cleanText(data[key]);
  return cleanedData;
}

/** Fetch user from Firestore */
export async function fetchUser(email) {
  if (!email) return null;
  try {
    const doc = await userCollection.doc(email).get();
    if (!doc.exists) return null;
    return JSON.parse(JSON.stringify(doc.data()));
  } catch (error) {
    console.error(`Error fetching user ${email}:`, error);
    throw error;
  }
}

/** Check if user exists in Firestore */
export async function isUserExist(email) {
  if (!email) return false;
  return (await fetchUser(email)) !== null;
}

/** Save user to Firestore */
export async function saveUser(email, data) {
  if (!email || !data) return;
  try {
    await userCollection.doc(email).set(cleanUserData(data), { merge: true });
  } catch (error) {
    console.error(`Error saving user ${email}:`, error);
    throw error;
  }
}

/** Update last access date & store basic user info if given */
export async function updateUserAccess(email, data = {}) {
  if (!email) return;

  const today = getKoreanHourString();
  const user = await fetchUser(email);

  if (!user) {
    await saveUser(email, { lastAccessDate: today, lastContributionDate: today, isAdmin: false, isPrestige: false, ...data });
    return;
  }

  let updated = false;
  if (user.lastAccessDate !== today) { user.lastAccessDate = today; updated = true; }

  for (const key of ["studentName", "studentPosition", "studentMajor"]) {
    if (data[key] && user[key] !== data[key]) { user[key] = data[key]; updated = true; }
  }

  if (updated) await saveUser(email, user);
}

/** Update last access date */
export async function updateUserAccessDate(email) {
  if (!email) return;

  const today = getKoreanHourString();
  const user = await fetchUser(email);

  if (!user) {
    await saveUser(email, { lastAccessDate: today, lastContributionDate: today, isAdmin: false, isPrestige: false });
    return;
  }

  if (user.lastAccessDate !== today) { user.lastAccessDate = today; await saveUser(email, user); }
}

/** Fetch all users from Firestore */
export async function fetchAllUser() {
  try {
    const snapshot = await userCollection.get();
    const users = [];
    snapshot.forEach(doc => users.push({ email: doc.id, ...doc.data() }));
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
}
