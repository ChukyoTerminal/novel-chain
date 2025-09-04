import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      tags: { select: { tag: { select: { name: true } } } },
      posts: { select: { ratings: { select: { score: true } } } },
      subscriptions: { select: { id: true } },
      owner: {
        select: {
          id: true,
          name: true,
          displayName: true
        }
      }
    }
  });

  if (!thread) {
    return new Response(JSON.stringify({ error: 'Thread not found' }), { status: 404 });
  }

  const rating = thread.posts.reduce((sum, post) => sum + post.ratings.reduce((s, r) => s + r.score, 0), 0);
  const follower_count = thread.subscriptions.length;

  const result = {
    id: thread.id,
    title: thread.title,
    tags: thread.tags.map(t => t.tag.name),
    rating,
    follower_count,
    owner: {
      id: thread.owner.id,
      name: thread.owner.name,
      display_name: thread.owner.displayName ?? ''
    },
    created_at: thread.createdAt,
    updated_at: thread.updatedAt
  };

  return new Response(JSON.stringify(result), { status: 200 });
}
