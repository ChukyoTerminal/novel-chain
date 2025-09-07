'use client'

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LuSend } from 'react-icons/lu';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'next/navigation';

export default function WriteThreadPage() {
  const [content, setContent] = useState('');
  const maxLength = 500;
  const minLength = 100;
  const { threadId } = useParams();
  let title = '続きの投稿';

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= maxLength) {
      setContent(newContent);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/threads/${threadId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        // 投稿成功時にロック解除
        try {
          await fetch(`/api/threads/${threadId}/lock`, { method: 'DELETE' });
        } catch {}
        alert('投稿しました！');
        setContent('');
      } else {
        alert('投稿に失敗しました');
      }
    } catch {
      alert('通信エラーが発生しました');
    }
  };

  async function fetchThreadTitle() {
    const threadData = await fetch(`/api/threads/${threadId}`);

    if(threadData.ok) {
      const thread = await threadData.json();
      title = thread.title;
    }
  }

  fetchThreadTitle();

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
      <Header label={title} showBackButton={true} />
      <main className="flex px-4 gap-6 max-w-8xl mx-auto h-[calc(100vh-140px)] mb-8">
        <div className="w-80 flex-shrink-0" />
        <div className="flex-1 flex justify-center">
          <Card className="px-6 py-4 w-full max-w-7xl h-full flex flex-col">
            <CardHeader className="flex flex-col md:flex-row md:items-center w-full">
              <h2 className="text-2xl font-bold">続きの投稿</h2>
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
                  disabled={content.trim().length < minLength || content.trim().length > maxLength}
                  className="flex items-center gap-2"
                  size={'super'}
                >
                  <LuSend size={16} />
                  投稿する
                </Button>
              </div>
            </CardContent>
          </Card>
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
