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
 * getUserv2 returns user info if logged in, otherwise returns undefined.
 *
 * Return format:
 * undefined OR {
 *   admin: boolean,
 *   email: string,
 *   name: string,
 *   position: string,
 *   major: string,
 *   lastAccess: string,
 *   lastContribute: string
 * }
**/
export async function getUserv2() {
  const session = await getServerSession(authOptions);
  if (!session) return undefined;

  const user = await fetchUser(session.user.email);
  return {
    admin: user?.isAdmin ?? false,
    email: session.user.email,
    name: user?.studentName ?? null,
    position: user?.studentPosition ?? null,
    major: user?.studentMajor ?? null,
    lastAccess: user?.lastAccessDate ?? null,
    lastContribute: user?.lastContributionDate ?? null,
  };
}