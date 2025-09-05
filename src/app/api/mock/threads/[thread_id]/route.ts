import { NextResponse, NextRequest } from 'next/server';
import { mockThreads } from '@/lib/mockData';

export async function GET(request:NextRequest,{ params }: {params: {thread_id: string}}) {
  const thread = mockThreads.find(t => t.id === params.thread_id);

  return thread ? NextResponse.json(thread) : NextResponse.json({ error: 'Thread not found' }, { status: 404 });
}