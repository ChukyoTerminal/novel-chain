 
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LuBookOpen, LuPenTool, LuStar } from 'react-icons/lu';
import Link from 'next/link';
import Logo from './logo';

export function HeroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-paper)] to-[#dfd0a7]">
      {/* メインコンテンツ */}
      <main className=" mx-auto px-4 py-16 w-full">
        {/* ヒーローセクション */}
        <section className="text-center mb-20 max-w-6xl mx-auto">
          <div className='flex justify-center mb-6'>
            <Logo height={100} />
          </div>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
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
                    onClick={() => globalThis.location.href = '/auth/login'}
                  >
                    ログイン
                  </Button>
                  <Button
                    size="super"
                    className="text-lg px-8 py-3"
                    variant="outline"
                    onClick={() => globalThis.location.href = '/auth/signin'}
                  >
                    新規登録
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 特徴セクション：縦並び */}
        <section className="flex flex-col mb-20 mx-auto">
          <div className="w-fit mx-auto">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <LuPenTool size={28} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">共同創作</h3>
            </div>
            <p className="text-base text-gray-700 pl-16">
              複数のユーザーが交代で執筆するリレー小説。
              一人では思いつかない展開や発想が生まれます。
            </p>
          </div>
          <div className="w-fit mx-auto">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <LuStar size={28} className="text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">評価システム</h3>
            </div>
            <p className="text-base text-gray-700 pl-16">
              読者評価により、質の高いリレー小説が発見されやすくなります。
            </p>
          </div>
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
            <p>&copy; 2025 NovelChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
