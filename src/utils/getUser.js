/* @/utils/getUser.js */

// Server Only
import "server-only";
// React
import { cache } from "react";
// Next
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
// Database
import { fetchUser } from "@/utils/database/userDB";

/**
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
  // Get and verify JWT
  const requestHeaders = await headers();
  const token = await getToken({
    req: { headers: { cookie: requestHeaders.get("cookie") ?? "" } },
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.email) {
    return {
      login: false, admin: false, prestige: false,
      email: null, name: "", position: "", major: "", fullName: "",
      lastAccess: null, lastContribute: null,
    };
  }

  // Fetch user from database
  const email = token.email;
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
