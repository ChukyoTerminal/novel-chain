/* eslint-disable max-len */
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;

  const posts = await prisma.post.findMany({
    where: { threadId },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          displayName: true
        }
      },
      histories: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { content: true }
      }
    }
  });

  const result = {
    posts: posts.map(post => ({
      id: post.id,
      content: post.histories[0]?.content ?? '',
      author: {
        id: post.author.id,
        name: post.author.name,
        display_name: post.author.displayName ?? ''
      },
      created_at: post.createdAt,
      updated_at: post.updatedAt
    }))
  };

  return new Response(JSON.stringify(result), { status: 200 });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const token = await getToken({ req: request });
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const userId = token.sub;

  let body: { content?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
  if (!body.content) {
    return new Response(JSON.stringify({ error: 'content is required' }), { status: 400 });
  }

  try {
    const post = await prisma.post.create({
      data: {
        threadId,
        authorId: userId,
        histories: {
          create: {
            content: body.content
          }
        }
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return new Response(JSON.stringify({ id: post.id, created_at: post.createdAt, updated_at: post.updatedAt }), { status: 201 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to create post' }), { status: 500 });
  }
}
