import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const threadId = request.nextUrl.pathname.split('/').at(-1);
  console.log('[DEBUG] threadId:', threadId);
  if (!threadId) {
    console.error('[ERROR] threadId is required');
    return new Response('threadId is required', { status: 400 });
  }

  const postsUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/threads/${threadId}/posts`;
  console.log('[DEBUG] postsUrl:', postsUrl);
  const postsResponse = await fetch(postsUrl, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  console.log('[DEBUG] postsResponse status:', postsResponse.status);
  if (!postsResponse.ok) {
    console.error('[ERROR] Failed to fetch posts', await postsResponse.text());
    return new Response('Failed to fetch posts', { status: 500 });
  }

  const postsData = await postsResponse.json();
  console.log('[DEBUG] posts json:', postsData);
  const posts = Array.isArray(postsData.posts) ? postsData.posts : [];
  if (!Array.isArray(posts)) {
    console.error('[ERROR] Invalid posts data', postsData);
    return new Response('Invalid posts data', { status: 500 });
  }

  // contentを順番に連結
  const mergedContent = posts.map(post => post.content).join('');
  console.log('[DEBUG] mergedContent:', mergedContent);

  return new Response(JSON.stringify({ mergedContent }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
