import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
  providers: [
    // 今は空のプロバイダー配列（後で設定可能）
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        type CustomUser = typeof session.user & { id?: string };
        (session.user as CustomUser).id = token.id as string;
      }
      return session;
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
