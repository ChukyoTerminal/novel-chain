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
import { ColorSchemeToggle } from '@/components/colorSchemeToggle';

export default function Home() {
  const { data: session, status } = useSession();
  const [threads, setThreads] = useState<Thread[]>([]);

  const availableTags = ['ミステリー', 'ファンタジー', 'SF', '恋愛', 'ホラー', 'ライトノベル'];

  useEffect(() => {
    if (status === 'loading') return;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/threads');
        if (response.ok) {
          const data = await response.json();
          setThreads(data.threads);
          console.log(data.threads);
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
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
    <div className="min-h-screen pb-16 overflow-x-hidden bg-amber-50 dark:bg-gray-700 max-w-screen">
      <Header label="NovelChain" showBackButton={false} />
      <main className="flex flex-col space-y-8 mb-4">
        {/* テーマ切り替えボタン */}
        <div className="flex justify-end mt-4">
          {/* ColorSchemeToggle をインポートして使用 */}
          <ColorSchemeToggle />
        </div>
        {threads.length > 0 ? (
          <>
            <section className="px-40">
              <h2 className="text-2xl font-bold mb-4">おすすめのスレッド</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedThreads.map((thread) => (
                  <ThreadCard key={`recommended-${thread.id}`} thread={thread} color="blue" />
                ))}
              </div>
            </section>

            <BookShelfSeparator width="400" />

            {/* 新着のスレッド */}
            <section className="px-40 mx-auto">
              <h2 className="text-2xl font-bold mb-4">新着のスレッド</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newThreads.map((thread) => (
                  <ThreadCard key={`new-${thread.id}`} thread={thread} color="gray" />
                ))}
              </div>
            </section>

            <BookShelfSeparator width="300" />

            {/* タグ別のスレッド */}
            {availableTags.map((tag, index) => {
              const tagThreads = getThreadsByTag(tag);
              if (tagThreads.length === 0) return null;

              return (
                <div key={tag}>
                  {index > 0 && <BookShelfSeparator width="220" />}
                  <section className="px-40">
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
        {/* デバッグ用：全スレッドロック解除ボタン */}
        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-3 bg-red-600 text-white rounded shadow hover:bg-red-700"
            onClick={async () => {
              if (!globalThis.confirm('本当に全スレッドのロックを解除しますか？')) return;
              let success = 0;
              for (const thread of threads) {
                try {
                  const response = await fetch(`/api/threads/${thread.id}/lock`, { method: 'DELETE' });
                  if (response.ok) success++;
                } catch {}
              }
              alert(`ロック解除完了: ${success}件`);
            }}
          >
            すべてのスレッドのロックを解除（デバッグ）
          </button>
        </div>
      </main>
      <Footer />
    </div>
  ) : (
    // ログインしていない場合
    <HeroPage />
  );
}
