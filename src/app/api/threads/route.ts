import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const limitParameter = url.searchParams.get('limit');
  const offsetParameter = url.searchParams.get('offset');
  const limit = Math.max(1, Math.min(Number(limitParameter) || 20, 100)); // 1〜100件
  const offset = Math.max(0, Number(offsetParameter) || 0);

  const threads = await prisma.thread.findMany({
    skip: offset,
    take: limit,
    select: {
      id: true,
      title: true,
      summary: true,
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

  const result = {
    threads: threads.map(thread => {
      // rating: このスレッドの全投稿のPostRating合計
      const rating = thread.posts.reduce((sum, post) => sum + post.ratings.reduce((s, r) => s + r.score, 0), 0);
      // follower_count: subscriptions数
      const follower_count = thread.subscriptions.length;
      return {
        id: thread.id,
        title: thread.title,
        summary: thread.summary,
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
    })
  };

  return new Response(JSON.stringify(result), { status: 200 });
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const userId = token.sub;

  let body: { title?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
  if (!body.title || !body.content) {
    return new Response(JSON.stringify({ error: 'title and content are required' }), { status: 400 });
  }

  try {
    const thread = await prisma.thread.create({
      data: {
        title: body.title,
        summary: body.content.slice(0, 100), // サマリーは先頭100文字
        ownerId: userId,
        posts: {
          create: {
            authorId: userId,
            histories: {
              create: {
                content: body.content
              }
            }
          }
        }
      },
      select: { id: true }
    });
    return new Response(JSON.stringify({ id: thread.id }), { status: 201 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to create thread' }), { status: 500 });
  }
}
