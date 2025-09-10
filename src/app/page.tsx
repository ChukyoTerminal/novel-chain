/* eslint-disable max-len */
'use client'

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Thread } from '@/types';
import { ThreadCard } from '@/components/threadCard';
import { useSession } from 'next-auth/react';
import { BookShelfSeparator } from '@/components/bookShelfSeparator';
import { ColorSchemeToggle } from '@/components/colorSchemeToggle';

export default function Home() {
  // ThreadCard用の色リスト
  const threadColors = ['blue', 'red', 'green', 'yellow', 'purple', 'gray'] as const;
  // eslint-disable-next-line sonarjs/pseudo-random
  const getRandomColor = (): typeof threadColors[number] => threadColors[Math.floor(Math.random() * threadColors.length)];
  // eslint-disable-next-line sonarjs/no-unused-vars, sonarjs/no-dead-store
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
          console.log('[DEBUG] fetched threads:', data);
          setThreads(data.threads ?? []);
          console.log(data);
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
    .toSorted((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // 新着のスレッド（作成日時の新しい順）
  const newThreads = threads
    .toSorted((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  // タグ別にスレッドを分類
  const getThreadsByTag = (tag: string) => {
    return threads
      .filter(thread => thread.tags.includes(tag))
      .toSorted((a, b) => b.rating - a.rating)
      .slice(0, 4);
  };

  if (status === 'loading' || (threads.length === 0 && status === 'authenticated')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[var(--color-paper)] to-[#dfd0a7] dark:from-[#546072] dark:to-gray-700">
        <div className="flex flex-col items-center">
          <div className="flex space-x-2 animate-bounce">
            <div className="w-4 h-4 bg-text rounded-full" />
            <div className="w-4 h-4 bg-text rounded-full" style={{ animationDelay: '0.2s' }} />
            <div className="w-4 h-4 bg-text rounded-full" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-2xl mt-6 text-text dark:text-text-dark">Loading...</p>
        </div>
      </div>
    );
  }

  return(
    <div className="min-h-screen pb-16 overflow-x-hidden bg-gradient-to-b from-[var(--color-paper)] to-[#dfd0a7] dark:from-[#546072] dark:to-gray-700 max-w-screen">
      <Header label="logo" showBackButton={false} />
      <main className="flex flex-col space-y-8 mb-4">
        {/* テーマ切り替えボタン */}
        <div className="flex justify-end mt-4">
          {/* ColorSchemeToggle をインポートして使用 */}
          <ColorSchemeToggle />
        </div>
        {threads.length > 0 ? (
          <>
            <section className="px-40">
              <h2 className="text-2xl font-bold mb-4">おすすめの小説</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedThreads.map((thread) => (
                  <ThreadCard key={`recommended-${thread.id}`} thread={thread} color={getRandomColor()} />
                ))}
              </div>
            </section>

            <BookShelfSeparator width="400"/>

            {/* 最近更新された小説 */}
            <section className="px-40">
              <h2 className="text-2xl font-bold mb-4">最近更新された小説</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newThreads.map((thread) => (
                  <ThreadCard key={`new-${thread.id}`} thread={thread} color={getRandomColor()} />
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
                        <ThreadCard key={`${tag}-${thread.id}`} thread={thread} color={getRandomColor()} />
                      ))}
                    </div>
                  </section>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <h2 className="text-2xl font-bold mb-4">現在表示できる小説はありません</h2>
            <div className="flex space-x-2 animate-bounce">
              <div className="w-4 h-4 bg-text dark:bg-white rounded-full" />
              <div className="w-4 h-4 bg-text dark:bg-white rounded-full" style={{ animationDelay: '0.2s' }} />
              <div className="w-4 h-4 bg-text dark:bg-white rounded-full" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
        <div className="h-20" />
        {/* デバッグ用：全スレッドロック解除ボタン */}
        <div className="flex justify-center mt-8">
          <div className="flex flex-col gap-4 items-center">
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
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
              onClick={async () => {
                if (!globalThis.confirm('全スレッドのあらすじを再生成しますか？')) return;
                let success = 0;
                for (const thread of threads) {
                  try {
                    const response = await fetch(`/api/gemini/book-summary-generator/${thread.id}`, { method: 'PUT' });
                    if (response.ok) success++;
                  } catch {}
                }
                alert(`あらすじ再生成完了: ${success}件`);
              }}
            >
              すべてのスレッドのあらすじを再生成（デバッグ）
            </button>
            <button
              className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700"
              onClick={async () => {
                if (!globalThis.confirm('全スレッドのタグを再生成しますか？')) return;
                let success = 0;
                for (const thread of threads) {
                  try {
                    const response = await fetch(`/api/gemini/book-tag-generator/${thread.id}`, { method: 'POST' });
                    if (response.ok) success++;
                  } catch {}
                }
                alert(`タグ再生成完了: ${success}件`);
              }}
            >
              すべてのスレッドのタグを再生成（デバッグ）
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
