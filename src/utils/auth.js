// @/utils/auth.js

// Get Server Session
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Fetch User from Database
import { fetchUser } from "@/utils/database/userDB";

/**
 * Returns detailed user info based on session.
 * Keeps nested structure for user_info.
 */
export async function getUserInfo(session) {
  if (!session) {
    return {
      do_user_login: false,
      user_email: null,
      is_user_admin: false,
      last_access: null,
      last_contribute: null,
      user_info: {
        student_name: null,
        student_position: null,
        student_major: null,
      },
    };
  }

  const user = await fetchUser(session.user.email);
  return {
    do_user_login: true,
    user_email: session.user.email,
    is_user_admin: user?.isAdmin ?? false,
    last_access: user?.lastAccessDate ?? null,
    last_contribute: user?.lastContributionDate ?? null,
    user_info: {
      studentName: user?.studentName ?? null,
      studentPosition: user?.studentPosition ?? null,
      studentMajor: user?.studentMajor ?? null,
    },
  };
}

/**
 * Wrapper function that combines getServerSession and getUserInfo.
 * Returns nested userInfo structure.
 */
export async function getUser() {
  const session = await getServerSession(authOptions);
  return getUserInfo(session);
}

/**
 * Returns a flat user object with consistent structure based on authentication status.
 *
 * - If the user is **not logged in**, returns a default object with `login: false` and null/default values.
 * - If the user **is logged in**, fetches and returns user details from the database.
 *
 * @async
 * @function getUserv2
 * @returns {Promise<{
*   login: boolean,
*   admin: boolean,
*   email: string | null,
*   name: string | null,
*   position: string | null,
*   major: string | null,
*   lastAccess: string | null,
*   lastContribute: string | null,
*   fullName: string
* }>} A user object with consistent structure.
*/
export async function getUserv2() {
  // Chack Server Session
  const session = await getServerSession(authOptions);
  if (!session) {
    return { login: false, admin: false, isPrestige: false,
      email: null, name: null, position: null, major: null,
      lastAccess: null, lastContribute: null,
    };
  }
  
  // Get user data
  const user = await fetchUser(session.user.email);
  const name = user?.studentName ?? "";
  const position = user?.studentPosition ?? "";
  const major = user?.studentMajor ?? "";

  return {
    login: true, admin: user?.isAdmin ?? false, prestige: user?.isPrestige ?? false,
    email: session.user.email,
    name, position, major, fullName: `${name}/${position}/${major}`,
    lastAccess: user?.lastAccessDate ?? null,
    lastContribute: user?.lastContributionDate ?? null,
  };
}