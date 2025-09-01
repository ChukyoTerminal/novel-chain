'use client'

import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Thread } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
//import { useSession } from "next-auth/react";

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);

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

  return (
    <div className="min-h-screen">
      <Header label="NovelChain" showBackButton={false} />
      <main className="flex flex-col justify-between px-40">
        {threads.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {threads.map((thread) => (
              <Button key={thread.id} variant="outline" size="lg" className="w-full justify-center">
                <Link href={`/read/${thread.id}`} className="w-full">
                  <CardHeader className="w-full">
                    <CardTitle>{thread.title}</CardTitle>
                    <CardDescription>By {thread.owner.display_name}</CardDescription>
                  </CardHeader>
                </Link>
              </Button>
            ))}
          </div>
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
