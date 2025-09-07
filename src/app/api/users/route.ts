import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/utils/password';
import { redis } from '@/lib/redis';


/**
 * ユーザー登録APIエンドポイント。
 *
 * @param request - JSONボディに email, password_hash (SHA-256), name, ticket を含むPOSTリクエスト
 * @returns ユーザーIDを含むJSONレスポンス
 */
export async function POST(request: NextRequest) {
  let email: string | undefined, password_hash: string | undefined, name: string | undefined, ticket: string | undefined;
  try {
    ({ email, password_hash, name, ticket } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 });
  }
  if (!email || !password_hash || !name || !ticket) {
    return new Response(JSON.stringify({ error: 'email, password_hash, name, and ticket are required' }), { status: 400 });
  }

  // チケット検証（1回のみ有効）
  const storedTicket = await redis.get(`email-ticket:${email}`);
  if (!storedTicket || storedTicket !== ticket) {
    return new Response(JSON.stringify({ error: 'Invalid or expired ticket' }), { status: 400 });
  }
  await redis.del(`email-ticket:${email}`);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password_hash),
        name
      },
      select: { id: true }
    });
    return new Response(JSON.stringify({ user: { id: user.id } }), { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 409 });
    }
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
  }
}
