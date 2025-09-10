/* eslint-disable max-len */
'use client'

import { Post } from '@/types';
import { ChapterCard } from '@/components/chapterCard'
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ReadPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [threadTitle, setThreadTitle] = useState<string>('');
  const [threadSummary, setThreadSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 10;
  const parameters = useParams();
  const router = useRouter();
  const threadId = parameters.threadId as string;
  const { data: session } = useSession();

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
          if (threadData && threadData.summary) {
            setThreadSummary(threadData.summary);
          }
        }

        // 投稿一覧を取得（ページネーション対応）
        const offset = (currentPage - 1) * postsPerPage;
        const allPostsResponse = await fetch(`/api/threads/${threadId}/posts`);
        const postsResponse = await fetch(`/api/threads/${threadId}/posts?offset=${offset}&limit=${postsPerPage}`);
        if (postsResponse.ok && allPostsResponse.ok) {
          const postsData = await postsResponse.json();
          const allPosts = await allPostsResponse.json();
          setPosts(postsData.posts || []);
          setTotalPosts(allPosts.posts?.length || 0);
          console.log('投稿データ:', { 
            posts: postsData.posts?.length || 0, 
            total: allPosts.posts?.length || 0, 
            currentPage, 
            offset 
          });
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
  }, [threadId, currentPage, postsPerPage]);

  const handleBackClick = () => {
    router.push('/');
  };

  // ページネーション関連の計算
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // ページ変更時に上部へスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      <Header label={threadTitle || '小説を読む'} onBackClick={handleBackClick} showBackButton={true} isFixed={true} showFunctionButton={true} buttonLabel="フォロー" onFunctionButtonClick={() => {}} />
      <main className="relative flex justify-center px-8 py-4 mb-4 pt-24 max-w-7xl mx-auto">
        {/* 左側のあらすじアコーディオン（大画面用） */}
        {threadSummary && (
          <div className="hidden xl:block fixed left-8 top-24 w-80 z-10">
            <Card className="p-4 h-fit shadow-lg border-2 max-h-[80vh] overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="summary">
                  <AccordionTrigger className="text-lg font-semibold">
                    あらすじ
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="max-h-60 overflow-y-auto pr-2">
                      <p className="text-sm leading-relaxed break-words overflow-wrap-anywhere">
                        {threadSummary}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>
        )}

        {/* メインコンテンツ（中央配置） */}
        <div className="w-full max-w-4xl">
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <ChapterCard
                  key={post.id}
                  content={post.content}
                  author={post.author}
                  createdAt={post.created_at}
                  showReportButton={session?.user?.id !== post.author.id}
                  enableLikeButton={session?.user?.id !== post.author.id}
                />
              ))}
              
              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="mt-8 mb-4">
                  <Pagination>
                    <PaginationContent>
                      {/* Previous ボタン */}
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>

                      {/* ページ番号 */}
                      {(() => {
                        const pages = [];
                        const showEllipsis = totalPages > 7;
                        
                        if (!showEllipsis) {
                          // 7ページ以下の場合は全て表示
                          for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
                            pages.push(
                              <PaginationItem key={pageIndex}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(pageIndex);
                                  }}
                                  isActive={currentPage === pageIndex}
                                >
                                  {pageIndex}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        } else {
                          // 8ページ以上の場合は省略記号を使用
                          // 最初のページ
                          pages.push(
                            <PaginationItem key={1}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(1);
                                }}
                                isActive={currentPage === 1}
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                          );

                          if (currentPage > 3) {
                            pages.push(
                              <PaginationItem key="ellipsis1">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          // 現在のページ周辺
                          const start = Math.max(2, currentPage - 1);
                          const end = Math.min(totalPages - 1, currentPage + 1);
                          
                          for (let pageIndex = start; pageIndex <= end; pageIndex++) {
                            pages.push(
                              <PaginationItem key={pageIndex}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(pageIndex);
                                  }}
                                  isActive={currentPage === pageIndex}
                                >
                                  {pageIndex}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (currentPage < totalPages - 2) {
                            pages.push(
                              <PaginationItem key="ellipsis2">
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          // 最後のページ
                          if (totalPages > 1) {
                            pages.push(
                              <PaginationItem key={totalPages}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(totalPages);
                                  }}
                                  isActive={currentPage === totalPages}
                                >
                                  {totalPages}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }
                        }
                        
                        return pages;
                      })()}

                      {/* Next ボタン */}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                  
                  {/* ページ情報 */}
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    {totalPosts > 0 && (
                      <>
                        {((currentPage - 1) * postsPerPage) + 1}〜{Math.min(currentPage * postsPerPage, totalPosts)} 件目 
                        （全 {totalPosts} 件中）
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>投稿がありません</CardTitle>
                  <CardDescription>このスレッドにはまだ投稿がありません。</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>後でもう一度確認してください。</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* 右側のページリストサイドバー（右側空間の中央に配置） */}
        {totalPages > 1 && (
          <>
            {/* 大画面用：固定位置 */}
            <div className="hidden xl:block fixed right-8 top-1/2 transform -translate-y-1/2 w-80 z-10">
              <Card className="p-4 h-fit shadow-lg border-2 max-h-[80vh] overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    目次
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      const isCurrentPage = pageNumber === currentPage;
                    
                      return (
                        <div
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={
                            isCurrentPage 
                              ? 'group cursor-pointer px-3 py-2.5 rounded-md transition-all duration-200 border-l-3 bg-primary/10 border-l-primary text-primary font-medium shadow-sm' 
                              : 'group cursor-pointer px-3 py-2.5 rounded-md transition-all duration-200 border-l-3 hover:bg-secondary/50 border-l-transparent hover:border-l-secondary text-muted-foreground hover:text-foreground'
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${isCurrentPage ? 'font-medium' : ''}`}>
                                {pageNumber}ページ目
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                
                  {/* クイックナビゲーション */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="space-y-2">
                      <button
                        onClick={() => handlePageChange(1)}
                        className="w-full py-2.5 px-3 text-sm bg-background border border-border rounded-md hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                        disabled={currentPage === 1}
                      >
                        最初のページへ
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="w-full py-2.5 px-3 text-sm bg-background border border-border rounded-md hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                        disabled={currentPage === totalPages}
                      >
                        最後のページへ
                      </button>
                    </div>
                  
                    {/* 読書進度 */}
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <div className="text-sm font-medium mb-2 text-muted-foreground">読書進度</div>
                      <div className="bg-secondary/30 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-300"
                          style={{ width: `${(currentPage / totalPages) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-center">
                        {Math.round((currentPage / totalPages) * 100)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
