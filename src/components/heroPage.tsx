/* eslint-disable max-len */
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LuBookOpen, LuPenTool, LuStar } from 'react-icons/lu';
import Link from 'next/link';
import Logo from './logo';

export function HeroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 w-60">
            <Logo />
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
          <div className="flex justify-center">
            <Card className="w-full max-w-md mx-auto p-8">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">サインイン・新規登録</CardTitle>
                <CardDescription>Googleまたはメールでご利用いただけます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <Button
                    size="super"
                    className="text-lg px-8 py-3"
                    variant="outline"
                    onClick={() => import('next-auth/react').then(module_ => module_.signIn('google', { callbackUrl: '/' }))}
                  >
                    <svg xmlns="/Google_G_logo.svg" viewBox="0 0 48 48" width="24" height="24" className="inline-block mr-2 align-middle"><path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C36.36 2.34 30.55 0 24 0 14.61 0 6.27 5.7 2.13 14.1l8.06 6.27C12.6 13.16 17.87 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.18 5.36-4.64 7.02l7.18 5.59C43.73 37.16 46.1 31.3 46.1 24.5z"/><path fill="#FBBC05" d="M10.19 28.37c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.7 16.61 0 20.19 0 24c0 3.81.7 7.39 2.13 10.23l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.55 0 12.36-2.16 16.98-5.89l-7.18-5.59c-2.01 1.35-4.59 2.15-7.3 2.15-6.13 0-11.4-3.66-13.81-8.87l-8.06 6.27C6.27 42.3 14.61 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                    Googleでサインイン
                  </Button>
                  <Button
                    size="super"
                    className="text-lg px-8 py-3"
                    variant="outline"
                    onClick={() => globalThis.location.href = '/auth/login'}
                  >
                    メールでログイン
                  </Button>
                  <Button
                    size="super"
                    className="text-lg px-8 py-3"
                    variant="outline"
                    onClick={() => globalThis.location.href = '/auth/signin'}
                  >
                    メールで新規登録
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          {/* Googleサインインボタンのみ表示 */}
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
