'use client'

import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Thread } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { LuHeart } from "react-icons/lu";
//import { useSession } from "next-auth/react";

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);

  const availableTags = ["ミステリー", "ファンタジー", "SF", "恋愛", "ホラー", "ライトノベル"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const threadRes = await fetch('/api/mock/threads');

        if (threadRes.ok) {
          const threadData = await threadRes.json();
          setThreads(threadData.threads);
          console.log(threadData.threads);
        }
      }
      catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

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

  // ThreadCardコンポーネント
  const ThreadCard = ({ thread }: { thread: Thread }) => (
    <Card key={thread.id} className="w-60 min-h-40 p-0 overflow-hidden">
      <Button variant="ghost" size="lg" className="w-full h-full p-0">
        <Link href={`/read/${thread.id}`} className="w-full h-full flex flex-col p-2">
          <CardHeader className="w-full pb-2 px-0">
            <CardTitle className="text-left flex content-between px-1">
              <p className="text-xl flex overflow-hidden">{thread.title}</p>
              <div className="flex items-center gap-1 ml-auto text-sm text-muted-foreground">
                <LuHeart />
                <span>{thread.rating}</span>
              </div>
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-1">
              {thread.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <p className="line-clamp-6 text-left text-sm text-muted-foreground break-words whitespace-normal overflow-hidden">{thread.summary}</p>
          </CardContent>
        </Link>
      </Button>
    </Card>
  );

  return (
    <div className="min-h-screen pb-16">
      <Header label="NovelChain" showBackButton={false} />
      <main className="flex flex-col px-40 space-y-8 mb-4">
        {threads.length > 0 ? (
          <>
            {/* おすすめのスレッド */}
            <section>
              <h2 className="text-2xl font-bold mb-4">おすすめのスレッド</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedThreads.map((thread) => (
                  <ThreadCard key={`recommended-${thread.id}`} thread={thread} />
                ))}
              </div>
            </section>

            <Separator className="my-8" />

            {/* 新着のスレッド */}
            <section>
              <h2 className="text-2xl font-bold mb-4">新着のスレッド</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newThreads.map((thread) => (
                  <ThreadCard key={`new-${thread.id}`} thread={thread} />
                ))}
              </div>
            </section>

            <Separator className="my-8" />

            {/* タグ別のスレッド */}
            {availableTags.map((tag, index) => {
              const tagThreads = getThreadsByTag(tag);
              if (tagThreads.length === 0) return null;

              return (
                <div key={tag}>
                  {index > 0 && <Separator className="my-8" />}
                  <section>
                    <h2 className="text-2xl font-bold mb-4">{tag}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {tagThreads.map((thread) => (
                        <ThreadCard key={`${tag}-${thread.id}`} thread={thread} />
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
      </main>
      <Footer />
    </div>
  )

  /*
  const { data: session } = useSession();
  // ログインしている場合
  if (session) {
    return (
      <div className="min-h-screen">
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <p className="text-2xl">Hello, {session.user?.name}</p>
        </main>
      </div>
    );
  }
  else {
    // ログインしていない場合
    return (
      <div className="min-h-screen">
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <p className="text-2xl">Please log in</p>
        </main>
      </div>
    );
  }
  */
}
