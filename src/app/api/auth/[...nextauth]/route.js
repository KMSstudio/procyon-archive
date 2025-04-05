/* @/app/api/auth/[...nextauth]/route.js */

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { isUserExist, updateUserAccess } from '@/utils/database/userDB';
// Utils
import logger from "@/utils/logger";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, profile }) {
      const email = (profile?.email || "");
      const rawName = profile?.name || "";

      const [name, position, major] = rawName.split("/");
      const userData = { studentName: name, studentPosition: position, studentMajor: major };
      logger.info(`「${rawName}」 가 로그인을 시도합니다.`);

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
      logger.info(`「${rawName}」 가 회원가입 했습니다.`);
      return true;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };