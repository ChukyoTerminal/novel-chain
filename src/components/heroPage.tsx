import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LuBookOpen, LuPenTool, LuStar } from 'react-icons/lu';
import Link from 'next/link';

export function HeroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <LuBookOpen size={32} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">NovelChain</h1>
          </div>
          <div className="flex space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost">ログイン</Button>
            </Link>
            <Link href="/auth/signin">
              <Button>新規登録</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* ヒーローセクション */}
        <section className="text-center mb-20">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            みんなで紡ぐ<br />
            <span className="text-blue-600">リレー小説</span>プラットフォーム
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            NovelChainで新しい創作体験を始めませんか？
            ユーザー同士がバトンを繋いで、一つの物語を共同で創り上げる場所です。
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/login">
              <Button size="super" className="text-lg px-8 py-3">
                リレー小説を始める
              </Button>
            </Link>
          </div>
        </section>

        {/* 特徴セクション */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <Card className="text-center p-6 w-80">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <LuPenTool size={32} className="text-blue-600" />
              </div>
              <CardTitle className="text-xl">共同創作</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                複数のユーザーが交代で執筆するリレー小説。
                一人では思いつかない展開や発想が生まれます。
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6 w-80">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <LuStar size={32} className="text-yellow-600" />
              </div>
              <CardTitle className="text-xl">評価システム</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                読者評価により、質の高いリレー小説が発見されやすくなります。
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        {/* 人気ジャンル */}
        <section className="text-center mb-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">人気ジャンル</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['ファンタジー', 'SF', '恋愛', 'ミステリー', 'ホラー', 'ライトノベル'].map((genre) => (
              <Badge key={genre} variant="secondary" className="text-lg px-4 py-2">
                {genre}
              </Badge>
            ))}
          </div>
        </section>

        {/* CTA セクション */}
        <section className="bg-blue-600 text-white rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">あなたの物語を待っている読者がいます</h3>
          <p className="text-xl mb-8 opacity-90">
            今すぐNovelChainに参加して、物語の続きを紡いでみませんか？
          </p>
          <Link href="/auth/signin">
            <Button size="super" variant="secondary" className="text-lg px-8 py-3">
              リレー小説に参加する
            </Button>
          </Link>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <LuBookOpen size={24} />
                <span className="text-xl font-bold">NovelChain</span>
              </div>
              <p className="text-gray-400">
                ユーザー同士が協力して物語を紡ぐ、新しいリレー小説プラットフォーム
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サービス</h4>
              <ul className="space-y-2 text-gray-400">
                <li>リレー小説作成</li>
                <li>リレー小説参加</li>
                <li>作品閲覧</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サポート</h4>
              <ul className="space-y-2 text-gray-400">
                <li>ヘルプ</li>
                <li>お問い合わせ</li>
                <li>利用規約</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">アカウント</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/auth/login" className="hover:text-white">
                    ログイン
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signin" className="hover:text-white">
                    新規登録
                  </Link>
                </li>
                <li>パスワード忘れ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NovelChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
