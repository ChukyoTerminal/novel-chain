'use client'

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LuUser, LuPencil as LuEdit, LuSettings, LuLogOut } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { testUser } from '@/lib/mockData';
import { useEffect, useState } from 'react';
import { User } from '@/types';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      // セッションのメールアドレスに基づいてユーザー情報を取得
      const user = testUser; // ここを実際のデータ取得ロジックに置き換え
      setCurrentUser(user || null);
    }
  }, [session]);

  const handleBackClick = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const handleEdit = () => {
    // 編集ページへの遷移（未実装）
    alert('編集機能は未実装です');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen pb-16">
        <Header label="プロフィール" onBackClick={handleBackClick} showBackButton={true} />
        <main className="flex flex-col px-40 space-y-8 mb-4">
          <div className="text-center py-8">読み込み中...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session || !currentUser) {
    return (
      <div className="min-h-screen pb-16">
        <Header label="プロフィール" onBackClick={handleBackClick} showBackButton={true} />
        <main className="flex flex-col px-40 space-y-8 mb-4">
          <div className="text-center py-8">
            <p>ログインが必要です</p>
            <Button onClick={() => router.push('/auth/login')} className="mt-4">
              ログイン
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <Header label="プロフィール" onBackClick={handleBackClick} showBackButton={true} />
      <main className="flex flex-col px-40 space-y-8 mb-4">
        <section>
          <Card className="p-6">
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser.avatarUrl ? (
                    <Image
                      src={currentUser.avatarUrl}
                      alt={currentUser.display_name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <LuUser size={32} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{currentUser.display_name}</CardTitle>
                  <CardDescription className="mt-1">
                    フォロワー: {currentUser.follower_count}人 | 評価: {currentUser.rating}点
                  </CardDescription>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    {currentUser.email}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <LuEdit className="mr-2" size={16} />
                  編集
                </Button>
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LuLogOut className="mr-2" size={16} />
                  ログアウト
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {currentUser.posts.length > 0 ? (
                  `${currentUser.posts.length}件の投稿をしています。`
                ) : (
                  'まだ投稿がありません。'
                )}
                {currentUser.threads.length > 0 && (
                  ` ${currentUser.threads.length}件のスレッドを作成しています。`
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {currentUser.threads.length > 0 ? (
                  currentUser.threads
                    .flatMap(thread => thread.tags)
                    .filter((tag, index, array) => array.indexOf(tag) === index) // 重複削除
                    .slice(0, 5)
                    .map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))
                ) : (
                  <Badge variant="outline">まだタグがありません</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">統計情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">作成スレッド数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{currentUser.threads.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">総投稿数</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{currentUser.posts.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ユーザー評価</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{currentUser.rating}</p>
                <p className="text-sm text-muted-foreground">/ 100点</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">設定</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
                  <LuSettings className="mr-2" size={16} />
                  アカウント設定
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
                  <LuUser className="mr-2" size={16} />
                  プライバシー設定
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
                  <LuEdit className="mr-2" size={16} />
                  通知設定
                </Button>
                <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                  <LuLogOut className="mr-2" size={16} />
                  ログアウト
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
