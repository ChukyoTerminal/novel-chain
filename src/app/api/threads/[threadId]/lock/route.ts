import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const token = await getToken({ req: request });
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const userId = token.sub;

  try {
    const lock = await prisma.threadLock.create({
      data: {
        threadId,
        lockedBy: userId
      },
      select: { id: true, threadId: true, lockedBy: true }
    });
    return new Response(JSON.stringify(lock), { status: 201 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to lock thread' }), { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params;
  const token = await getToken({ req: request });
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    await prisma.threadLock.delete({
      where: { threadId },
    });
    return new Response(undefined, { status: 204 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Failed to unlock thread' }), { status: 500 });
  }
}
