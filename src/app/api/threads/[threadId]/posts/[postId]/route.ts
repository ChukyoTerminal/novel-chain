import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import jwt from 'next-auth/jwt';

export async function GET(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;

  // JWTからリクエストユーザーIDを取得
  let requestUserId: string | null = null;
  try {
    const token = await jwt.getToken({ req: request });
    requestUserId = token?.sub ?? null;
  } catch {}

  // 投稿データ取得
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      comments: true,
      ratings: true,
    }
  });

  if (!post) {
    return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
  }

  // 感想（コメント）を投稿したか
  let hasCommented = false;
  // 評価したか
  let hasRated = false;
  if (requestUserId) {
    hasCommented = post.comments.some(comment => comment.authorId === requestUserId);
    hasRated = post.ratings.some(rating => rating.raterId === requestUserId);
  }

  const result = {
    id: post.id,
    threadId: post.threadId,
    authorId: post.authorId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    hasCommented,
    hasRated,
  };

  return new Response(JSON.stringify(result), { status: 200 });
}
