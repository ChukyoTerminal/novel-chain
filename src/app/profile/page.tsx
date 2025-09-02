'use client'

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuUser, LuPencil as LuEdit, LuSettings } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen pb-16">
      <Header label="プロフィール" onBackClick={handleBackClick} showBackButton={true} />
      <main className="flex flex-col px-40 space-y-8 mb-4">
        {/* ユーザー情報 */}
        <section>
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <LuUser size={32} className="text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">ユーザー名</CardTitle>
                  <CardDescription className="mt-1">
                    フォロワー: 1,234人 | 評価: 89点
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <LuEdit className="mr-2" size={16} />
                編集
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                小説を書くことが趣味です。主にファンタジーとSF作品を執筆しています。
                読者の皆様とのコミュニケーションを大切にしています。
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">ファンタジー</Badge>
                <Badge variant="secondary">SF</Badge>
                <Badge variant="secondary">冒険</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 統計情報 */}
        <section>
          <h2 className="text-2xl font-bold mb-4">統計情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">投稿スレッド数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">総投稿数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">456</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">平均評価</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">4.2</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 設定 */}
        <section>
          <h2 className="text-2xl font-bold mb-4">設定</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <LuSettings className="mr-2" size={16} />
                  アカウント設定
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <LuUser className="mr-2" size={16} />
                  プライバシー設定
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <LuEdit className="mr-2" size={16} />
                  通知設定
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}
