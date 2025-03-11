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
      if (profile?.email?.endsWith("@snu.ac.kr")) {
        await updateUserAccess(profile.email);
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
