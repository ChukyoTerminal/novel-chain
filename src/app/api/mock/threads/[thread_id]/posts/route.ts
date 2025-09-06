import { NextResponse, NextRequest } from 'next/server';
import { mockThreads } from '@/lib/mockData';

export async function GET(request: NextRequest, { params }: { params: Promise<{ thread_id: string }> }) {
  const { thread_id } = await params;
  const thread = mockThreads.find(t => t.id === thread_id);

  if (thread) {
    const searchParameters = request.nextUrl.searchParams;
    const limit = searchParameters.get('limit') ? Number(searchParameters.get('limit')) : 50;
    const offset = searchParameters.get('offset') ? Number(searchParameters.get('offset')) : 0;
    const posts = thread.posts.slice(offset, offset + limit);

    return NextResponse.json({
      posts: posts,
    })
  }
}