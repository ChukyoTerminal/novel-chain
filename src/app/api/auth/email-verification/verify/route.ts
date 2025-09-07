import { randomUUID } from 'node:crypto';

import { NextRequest } from 'next/server';

import { redis } from '@/lib/redis';


/**
 * メール認証コード検証APIエンドポイント。
 *
 * @param request - JSONボディに email, code を含むPOSTリクエスト
 * @returns 認証チケットを含むJSONレスポンス
 */
export async function POST(request: NextRequest) {
  let email: string | undefined, code: string | undefined;
  try {
    ({ email, code } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 });
  }
  if (!email || !code) {
    return new Response(JSON.stringify({ error: 'email and code are required' }), { status: 400 });
  }
  const storedCode = await redis.get(`email-verification:${email}`);
  if (!storedCode || storedCode !== code) {
    return new Response(JSON.stringify({ error: 'Invalid code' }), { status: 400 });
  }
  // 認証成功時にコードを削除（1回のみ有効）
  await redis.del(`email-verification:${email}`);
  const ticket = randomUUID();
  await redis.set(`email-ticket:${email}`, ticket, { EX: 600 });
  return new Response(JSON.stringify({ ticket }), { status: 200 });
}
