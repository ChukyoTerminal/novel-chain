'use client'

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LuPlus, LuPenTool } from "react-icons/lu";

export default function WritePage() {
  return (
    <div className="min-h-screen pb-16">
      <Header label="執筆" showBackButton={false} />
      <main className="flex flex-col px-40 space-y-8 mb-4 h-full">
        {/* 新しいスレッドを作成 */}
          <h2 className="text-2xl font-bold mb-4">新しいスレッドを作成</h2>
          <Card className="p-6 h-full">
            <CardHeader className="text-center">
              <LuPlus size={48} className="mx-auto mb-4 text-muted-foreground" />
              <CardTitle>新しい小説を始めよう</CardTitle>
              <CardDescription>
                あなたの創作アイデアを形にして、読者と共有しましょう
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" className="mt-4">
                <LuPenTool className="mr-2" size={20} />
                スレッドを作成
              </Button>
            </CardContent>
          </Card>
      </main>
      <Footer />
    </div>
  );
}
