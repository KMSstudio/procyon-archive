// @/utils/getUser.js

// React
import { cache } from "react";
// NextAuth
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Database
import { fetchUser } from "@/utils/database/userDB";

/**
 * Returns the authenticated user's information with a consistent structure.
 * The result is memoized within a single React server render.
 *
 * @returns {Promise<{
 *   login: boolean,
 *   admin: boolean,
 *   prestige: boolean,
 *   email: string | null,
 *   name: string,
 *   position: string,
 *   major: string,
 *   fullName: string,
 *   lastAccess: string | null,
 *   lastContribute: string | null
 * }>}
 */
async function getUserv2Impl() {
  // Get server session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return {
      login: false, admin: false, prestige: false,
      email: null, name: "", position: "", major: "", fullName: "",
      lastAccess: null, lastContribute: null,
    };
  }

  // Fetch user from database
  const email = session.user.email;
  const user = await fetchUser(email);

  const name = user?.studentName ?? "";
  const position = user?.studentPosition ?? "";
  const major = user?.studentMajor ?? "";

  return {
    login: true, admin: user?.isAdmin ?? false, prestige: user?.isPrestige ?? false,
    email, name, position, major, fullName: `${name}/${position}/${major}`,
    lastAccess: user?.lastAccessDate ?? null,
    lastContribute: user?.lastContributionDate ?? null,
  };
}

export const getUserv2 = cache(getUserv2Impl);
