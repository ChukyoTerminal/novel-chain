import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { OidcProvider } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { sha1sum } from '@/utils/hash';
import { matchPassword } from '@/utils/password';
import { getTemporaryUserName } from '@/utils/user';


// JWTのsubをnon-nullableにする
declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
  }
}


/**
 * NextAuthのプロバイダーの型定義。
 */
type ClientType = {
  clientId: string;
  clientSecret: string;
};

/**
 * NextAuthのセッションユーザー型拡張
 */
declare module 'next-auth' {
  interface User {
    id: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}


/**
 * NextAuthのオプション。
 */
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        password_hash: { label: 'Password SHA-256', type: 'text' }
      },
      async authorize(credentials) {
        // 受け取るパスワードはSHA-256でハッシュ化されたものを想定
        if (!credentials?.email || !credentials?.password_hash) {
          return null;
        }
        const user = await prisma.user.findUnique({
          select: { id: true, passwordHash: true, isDeleted: true },
          where: { email: credentials.email }
        });
        if (!user) {
          // プライバシー保護のためハッシュ化してログ出力
          console.warn(`Failed login attempt with unknown email: ${await sha1sum(credentials.email)}`);
          return null;
        } else if (!user.passwordHash) {
          console.warn(`User attempted to sign in with credentials but has no password set: ${user.id}`);
          return null;
        } else if (await matchPassword(credentials.password_hash, user.passwordHash)) {
          if (user.isDeleted) {
            console.warn(`Deleted user attempted to sign in: ${user.id}`);
            return null;
          } else {
            console.log(`User signed in via credentials: ${user.id}`);
            return { id: user.id, email: credentials.email };
          }
        } else {
          console.warn(`Failed login attempt with incorrect password: ${user.id}`);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    } as ClientType),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7日間（秒単位）
  },
  callbacks: {
    async signIn({ user, account }) {
      switch (account?.provider) {
        case 'credentials': {
          // Credentialsプロバイダーはauthorizeで検証済みなのでそのまま通す
          return true;
        }
        case 'google': {
          // Google SSOでログインしたアカウントが登録されているか検証
          const registration = await prisma.user.findFirst({
            select: {
              id: true,
              isDeleted: true
            },
            where: {
              oidcAuthentications: {
                some: {
                  provider: OidcProvider.GOOGLE,
                  subject: account.providerAccountId
                }
              }
            },
          });
          if (registration) {
            if (registration.isDeleted) {
              console.warn(`Deleted user attempted to sign in via Google SSO: ${registration.id}`);
              return false;
            }
            user.id = registration.id;
            console.log(`User signed in via Google SSO: ${registration.id}`);
            return true;
          } else {
            // 登録されていない場合は新規登録
            if (!user.name || !user.email || !user.image) {
              console.error('Received incomplete user data from Google SSO');
              return false;
            }
            let temporaryName = await getTemporaryUserName(user.email);
            while (await prisma.user.findUnique({ select: { id: true }, where: { name: temporaryName } })) {
              temporaryName = await getTemporaryUserName(temporaryName);
            }
            const row = await prisma.user.create({
              data: {
                email: user.email,
                name: temporaryName,
                displayName: user.name,
                iconHash: null, // TODO: 画像の保存(Vercel Blob)とハッシュ化
                oidcAuthentications: {
                  create: {
                    provider: OidcProvider.GOOGLE,
                    subject: account.providerAccountId,
                  }
                }
              },
              select: { id: true },
            });
            user.id = row.id;
            console.log(`New user registered via Google SSO: ${row.id}`);
            return true;
          }
        }
        default: {
          break;
        }
      }
      // 許可しない場合はfalse
      return false;
    },
    async jwt({ token, user }) {
      if (user && user.id) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token.sub) {
        if (session.user) {
          session.user.id = token.sub;
        }
        else{
          session.user = { id: token.sub };
        }
      }
      return session;
    },
  },
};


/**
 * NextAuthのリクエストハンドラー。
 */
const handler = NextAuth(authOptions);


/**
 * GETおよびPOSTリクエストをNextAuthのリクエストハンドラーで処理する。
 */
export { handler as GET, handler as POST };
