import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { OidcProvider } from '@prisma/client';

import { prisma } from '@/lib/prisma';
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
 * NextAuthのオプション。
 */
const authOptions: NextAuthOptions = {
  providers: [
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
      // Google SSOでログインしたアカウントが登録されているか検証
      if (account?.provider === 'google') {
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
          // idをselectする必要は無いが、取得するカラムを減らすために指定
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
      // 許可しない場合はfalse
      return false;
    },
    async jwt({ token, user }) {
      if (user && user.id) {
        token.sub = user.id;
      }
      return token;
    }
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
