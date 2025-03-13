import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { updateUserAccess } from '@/utils/userDB';

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
      const name = profile?.name || "";
      // @snu.ac.kr
      if (!email.endsWith("@snu.ac.kr")) { 
        return "/login/nosnu"; }
      // Just for snu 'cse' 'student'
      if (process.env.AUTH_BLOCK_NOCSE === 'T'  &&  (!name.includes("학생") || !name.includes("컴퓨터공학부"))) { 
        return "/login/nocse"; }
      // Login success
      await updateUserAccess(email);
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