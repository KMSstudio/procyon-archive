// @/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { isUserExist, updateUserAccess } from '@/utils/database/userDB';
import logger from "@/utils/logger";

const JWT_VERSION = parseInt(process.env.AUTH_JWT_VERSION || "1");

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, profile }) {
      const email = (profile?.email || "");
      const rawName = profile?.name || "";

      const [name, position, major] = rawName.split("/");
      const userData = { studentName: name, studentPosition: position, studentMajor: major };
      logger.behavior(rawName, "로그인 시도");

      // if User Exist, Pass
      if (await isUserExist(email)){ 
        updateUserAccess(email, userData); return true; }
      // @snu.ac.kr
      if (!email.endsWith("@snu.ac.kr")) {
        return "/err/login/nosnu"; }
      // Just for snu 'student'
      if (process.env.AUTH_BLOCK_NOSTD === 'T' && (!rawName.includes("학생"))) {
        return "/arr/login/nostd"; }
      // Just for snu 'cse' 'student'
      if (process.env.AUTH_BLOCK_NOCSE === 'T'  &&  (!rawName.includes("학생") || !rawName.includes("컴퓨터공학부"))) {
        return "/err/login/nocse"; }
      // Login Accept
      await updateUserAccess(email, userData);
      logger.behavior(rawName, "회원가입");
      return true;
    },

    async jwt({ token, user }) {
      // JWT manage
      if (user) {
        token.email = user.email;
        token.version = JWT_VERSION;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.version !== JWT_VERSION) { return null; }
      session.user.email = token.email;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };