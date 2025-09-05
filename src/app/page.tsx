'use client'

import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HeroPage } from '@/components/heroPage';
import { Thread } from '@/types';
import { ThreadCard } from '@/components/threadCard';
import { useSession } from 'next-auth/react';
import { BookShelfSeparator } from '@/components/bookShelfSeparator';

export default function Home() {
  const { data: session, status } = useSession();
  const [threads, setThreads] = useState<Thread[]>([]);

  const availableTags = ['ミステリー', 'ファンタジー', 'SF', '恋愛', 'ホラー', 'ライトノベル'];

  useEffect(() => {
    if (status === 'loading') return;

    const fetchData = async () => {
      try {
        const threadResponse = await fetch('/api/mock/threads');

        if (threadResponse.ok) {
          const threadData = await threadResponse.json();
          setThreads(threadData.threads);
          console.log(threadData.threads);
        }
      }
      catch (e) {
        console.error('Error fetching data:', e);
      }
    }

    fetchData();
  }, [status]);

  // おすすめのスレッド（評価の高い順）
  const recommendedThreads = threads
    .filter(thread => thread.rating >= 90)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // 新着のスレッド（作成日時の新しい順）
  const newThreads = threads
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  // タグ別にスレッドを分類
  const getThreadsByTag = (tag: string) => {
    return threads
      .filter(thread => thread.tags.includes(tag))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen">
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <p className="text-2xl">Loading...</p>
        </main>
      </div>
    );
  }

  // ログインしている場合とそうでない場合を三項演算子で分岐
  return session ? (
    <div className="min-h-screen pb-16 overflow-x-hidden bg-amber-50">
      <Header label="NovelChain" showBackButton={false} />
      <main className="flex flex-col px-40 space-y-8 mb-4">
        {threads.length > 0 ? (
          <>
            <section>
              <h2 className="text-2xl font-bold mb-4">おすすめのスレッド</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedThreads.map((thread) => (
                  <ThreadCard key={`recommended-${thread.id}`} thread={thread} color="blue" />
                ))}
              </div>
            </section>

            <BookShelfSeparator width="220" />

            {/* 新着のスレッド */}
            <section>
              <h2 className="text-2xl font-bold mb-4">新着のスレッド</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newThreads.map((thread) => (
                  <ThreadCard key={`new-${thread.id}`} thread={thread} color="amber" />
                ))}
              </div>
            </section>

            <BookShelfSeparator width="220" />

            {/* タグ別のスレッド */}
            {availableTags.map((tag, index) => {
              const tagThreads = getThreadsByTag(tag);
              if (tagThreads.length === 0) return null;

              return (
                <div key={tag}>
                  {index > 0 && <BookShelfSeparator width="220" />}
                  <section>
                    <h2 className="text-2xl font-bold mb-4">{tag}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {tagThreads.map((thread) => (
                        <ThreadCard key={`${tag}-${thread.id}`} thread={thread} color="red" />
                      ))}
                    </div>
                  </section>
                </div>
              );
            })}
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Threads Available</CardTitle>
              <CardDescription>Please check back later.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>There are currently no threads to display. Please check back later.</p>
            </CardContent>
          </Card>
        )}
        <div className="h-20" />
      </main>
      <Footer />
    </div>
  ) : (
    // ログインしていない場合
    <HeroPage />
  );
}
