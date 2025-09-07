import { getToken } from 'next-auth/jwt';

import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';


export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const token = await getToken({ req: request });
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const currentUserId = token.sub;

  if (userId === currentUserId) {
    return new Response('You cannot follow yourself', { status: 400 });
  }

  // フォロー関係を作成
  try {
    await prisma.userFollow.create({
      data: {
        followerId: currentUserId,
        followeeId: userId,
      },
    });
  } catch (e) {
    console.error(e);
    return new Response('Failed to follow user', { status: 500 });
  }

  return new Response(undefined, { status: 201 });
}


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const token = await getToken({ req: request });
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  const currentUserId = token.sub;

  if (userId === currentUserId) {
    return new Response('You cannot unfollow yourself', { status: 400 });
  }

  // フォロー関係を削除
  try {
    await prisma.userFollow.delete({
      where: {
        followerId_followeeId: {
          followerId: currentUserId,
          followeeId: userId,
        },
      },
    });
  } catch (e) {
    console.error(e);
    return new Response('Failed to unfollow user', { status: 500 });
  }

  return new Response(undefined, { status: 204 });
}
