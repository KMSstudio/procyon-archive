/*
 * @/app/api/auth/[...nextauth]/route.js
*/

// Next Auth
import NextAuth from "next-auth";
// Google OAuth2
import GoogleProvider from "next-auth/providers/google";
// AWS Dynamo DB
import { updateUserAccess } from '@/utils/userDB';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // permit just @snu.ac.kr email
      // if (profile?.email?.endsWith("@snu.ac.kr")) { 
      if (true) { 
        updateUserAccess(profile.email);
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
