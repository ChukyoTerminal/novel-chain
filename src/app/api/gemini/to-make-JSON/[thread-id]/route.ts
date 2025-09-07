import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const threadId = request.nextUrl.pathname.split('/').at(-2);
  if (!threadId) {
    return new Response('threadId is required', { status: 400 });
  }

  // /api/threads/[threadId]/posts から投稿データを取得
  const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/threads/${threadId}/posts`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!postsResponse.ok) {
    return new Response('Failed to fetch posts', { status: 500 });
  }

  const posts = await postsResponse.json();
  if (!Array.isArray(posts)) {
    return new Response('Invalid posts data', { status: 500 });
  }

  // contentを順番に連結
  const mergedContent = posts.map(post => post.content).join('');

  return new Response(JSON.stringify({ mergedContent }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
