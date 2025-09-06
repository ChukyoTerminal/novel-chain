'use client'

import { Thread } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LuSend } from 'react-icons/lu';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<Thread[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const maxLength = 500;
  const router = useRouter();
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/threads');
        if (response.ok) {
          const data = await response.json();
          setThreads(data.threads || []);
        }
      } catch {
        setThreads([]);
      }
    };
    fetchThreads();
  }, []);

  useEffect(() => {
    const filterThreads = async () => {
      // ユーザー情報取得（NextAuth）
      const sessionResponse = await fetch('/api/auth/session');
      const session = sessionResponse.ok ? await sessionResponse.json() : null;
      const userId = session?.user?.id;
      console.log(session)
      console.log('[filterThreads] 現在のユーザーID:', userId);
      // 最新投稿が自分のもの or ロックされているものを除外
      const filtered: Thread[] = [];
      for (const thread of threads) {
        // 最新投稿取得
        let latestPostUser = '';
        let logMessage = `[候補判定] threadId=${thread.id}`;
        try {
          const postResponse = await fetch(`/api/threads/${thread.id}/posts`);
          if (postResponse.ok) {
            const postData = await postResponse.json();
            const posts = postData?.posts || [];
            const lastPost = posts.at(-1);
            latestPostUser = lastPost?.author?.id;
            logMessage += `, 最新投稿ユーザー=${latestPostUser}`;
            logMessage += `, 現在のユーザーID=${userId}`;
          } else {
            logMessage += ', 投稿取得失敗';
          }
        } catch {
          logMessage += ', 投稿取得例外';
        }
        if (latestPostUser === userId) {
          logMessage += ' →自分の投稿なので除外';
          console.log(logMessage);
          continue;
        }
        // ロック判定
        try {
          const lockResponse = await fetch(`/api/threads/${thread.id}/lock`, { method: 'POST' });
          logMessage += `, ロック判定status=${lockResponse.status}`;
          if (lockResponse.status !== 204) {
            logMessage += ' →ロックされているので除外';
            console.log(logMessage);
            continue;
          } else {
            logMessage += ' →ロックされていない';
          }
        } catch {
          logMessage += ' →ロック判定例外で除外';
          console.log(logMessage);
          continue;
        }
        logMessage += ' →候補に追加';
        console.log(logMessage);
        filtered.push(thread);
      }
      setFilteredThreads(filtered);
    };
    if (threads.length > 0) filterThreads();
  }, [threads]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= maxLength) {
      setContent(newContent);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        alert('新規スレッドを作成しました！');
        setTitle('');
        setContent('');
      } else {
        alert('スレッド作成に失敗しました');
      }
    } catch {
      alert('通信エラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <style dangerouslySetInnerHTML={{
        __html: `
                    :root {
                        /* 横線の調整変数 */
                        --line-height: 32px;        /* 行の高さ（横線の間隔） */
                        --line-position: 30px;      /* 横線の位置（行の下端からの距離） */
                        --line-thickness: 1px;      /* 横線の太さ */
                        --line-color: #d1d5db;      /* 通常時の横線の色 */
                        --line-color-focus: #6b7280; /* フォーカス時の横線の色 */
                    }
                    
                    .manuscript-textarea {
                        background-image: 
                            linear-gradient(to bottom, 
                                transparent var(--line-position), 
                                var(--line-color) var(--line-position), 
                                var(--line-color) calc(var(--line-position) + var(--line-thickness)), 
                                transparent calc(var(--line-position) + var(--line-thickness))
                            );
                        background-size: 100% var(--line-height);
                        line-height: var(--line-height) !important;
                        font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif !important;
                        padding: 8px 16px !important;
                        font-size: 16px !important;
                        background-attachment: local;
                        letter-spacing: 0.5px;
                        border-radius: 0 !important;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
                    }
                    .manuscript-textarea:focus {
                        outline: 2px solid var(--line-color-focus) !important;
                        outline-offset: -2px !important;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                    }
                `
      }} />
      <Header label="執筆" showBackButton={false} />
      {/* モーダル風スレッド選択 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">続きの投稿をするスレッドを選択</h2>
            <p className="text-muted-foreground mb-4">ランダムで3件表示しています</p>
            <div className="flex flex-col gap-4 mb-4">
              {filteredThreads.length > 0 ? (
                [...filteredThreads]
                  // eslint-disable-next-line sonarjs/pseudo-random
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 3)
                  .map(thread => (
                    <Button
                      key={thread.id}
                      className="w-full text-left"
                      variant="outline"
                      onClick={async () => {setShowModal(false); router.push(`/write/${thread.id}`); }}
                    >
                      {thread.title}
                    </Button>
                  ))
              ) : (
                <p>表示できるスレッドがありません</p>
              )}
            </div>
            <div className="text-center">
              <Button onClick={() => { setShowModal(false); setShowNewForm(true); }} size="super" className="px-8 py-3">
                新しく書く
              </Button>
            </div>
          </div>
        </div>
      )}
      <main className="flex px-4 gap-6 max-w-8xl mx-auto h-[calc(100vh-140px)] mb-8">
        <div className="w-80 flex-shrink-0" />
        <div className="flex-1 flex justify-center">
          {/* 新規作成フォームのみ表示 */}
          {showNewForm && (
            <Card className="px-6 py-4 w-full max-w-7xl h-full flex flex-col">
              <CardHeader className="flex flex-col md:flex-row md:items-center w-full">
                <Input
                  type="text"
                  placeholder="タイトルを入力"
                  className="text-2xl font-bold w-full h-12 border-gray-600 focus:ring-gray-700 focus:border-gray-700"
                  value={title}
                  onChange={handleTitleChange}
                />
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-2 flex-1 flex flex-col">
                  <Textarea
                    id="content"
                    value={content}
                    onChange={handleContentChange}
                    className="flex-1 resize-none manuscript-textarea border-2 border-gray-300"
                    maxLength={maxLength}
                    style={{ backgroundAttachment: 'local' }}
                  />
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700 mb-2">
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>文字数: {content.length}/{maxLength}</span>
                    <span className={content.length >= maxLength * 0.9 ? 'text-orange-500' : ''}>
                      {content.length >= maxLength ? '文字数上限に達しました' : ''}
                    </span>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      title.trim().length === 0 ||
                      content.trim().length < 100 ||
                      content.trim().length > maxLength
                    }
                    className="flex items-center gap-2"
                    size={'super'}
                  >
                    <LuSend size={16} />
                    投稿する
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="w-80 flex-shrink-0">
          <Card className="p-6 h-fit sticky top-4">
            <CardContent className="text-center">
              AIツール
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
