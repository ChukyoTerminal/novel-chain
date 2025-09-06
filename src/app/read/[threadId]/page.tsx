'use client'

import { Post } from '@/types';
import { ChapterCard } from '@/components/chapterCard'
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ReadPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [threadTitle, setThreadTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const parameters = useParams();
  const router = useRouter();
  const threadId = parameters.threadId as string;

  useEffect(() => {
    if (!threadId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // スレッド情報を取得してタイトルを設定
        const threadResponse = await fetch(`/api/threads/${threadId}`);
        if (threadResponse.ok) {
          const threadData = await threadResponse.json();
          if (threadData && threadData.title) {
            setThreadTitle(threadData.title);
          }
        }

        // 投稿一覧を取得
        const postsResponse = await fetch(`/api/threads/${threadId}/posts?limit=10&offset=0`);
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData.posts);
          console.log(postsData.posts);
        } else {
          console.error('Failed to fetch posts');
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [threadId]);

  const handleBackClick = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-16">
        <Header label="読み込み中..." isFixed={true} />
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <p>データを読み込んでいます...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <Header label={threadTitle || '小説を読む'} onBackClick={handleBackClick} showBackButton={true} isFixed={true} />
      <main className="flex flex-col items-center justify-between px-8 py-4 mb-4">
        {posts.length > 0 ? (
          <div className="w-full max-w-4xl space-y-4">
            {posts.map((post) => (
              <ChapterCard
                key={post.id}
                content={post.content}
                author={post.author}
                createdAt={post.created_at}
              />
            ))}
          </div>
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>投稿がありません</CardTitle>
              <CardDescription>このスレッドにはまだ投稿がありません。</CardDescription>
            </CardHeader>
            <CardContent>
              <p>後でもう一度確認してください。</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
