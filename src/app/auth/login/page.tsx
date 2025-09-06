/* eslint-disable max-len */
'use client'

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { LuBookOpen, LuArrowLeft } from 'react-icons/lu';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async () => {
    setError('');
    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (response?.error) {
      console.log(response.error);
      setError('メールアドレスまたはパスワードが正しくありません');
    } else {
      globalThis.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <LuArrowLeft size={20} className="text-gray-600" />
            <LuBookOpen size={32} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">NovelChain</h1>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-md mx-auto px-4 py-16">
        <Card className="p-6">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">ログイン</CardTitle>
            <CardDescription>
              NovelChainにログインしてリレー小説を楽しみましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="メールアドレス"
                className="border rounded px-4 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="パスワード"
                className="border rounded px-4 py-2"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button onClick={handleEmailLogin} className="w-full" variant="outline">
                メールでログイン
              </Button>
              <Button onClick={() => signIn('google', { callbackUrl:'/' })} className="w-full" variant="outline">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" className="inline-block mr-2 align-middle"><path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C36.36 2.34 30.55 0 24 0 14.61 0 6.27 5.7 2.13 14.1l8.06 6.27C12.6 13.16 17.87 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.18 5.36-4.64 7.02l7.18 5.59C43.73 37.16 46.1 31.3 46.1 24.5z"/><path fill="#FBBC05" d="M10.19 28.37c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.7 16.61 0 20.19 0 24c0 3.81.7 7.39 2.13 10.23l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.55 0 12.36-2.16 16.98-5.89l-7.18-5.59c-2.01 1.35-4.59 2.15-7.3 2.15-6.13 0-11.4-3.66-13.81-8.87l-8.06 6.27C6.27 42.3 14.61 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                Googleでログイン
              </Button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
            <div className="text-center mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                アカウントをお持ちでない方は{' '}
                <Link href="/auth/signin" className="text-blue-600 hover:underline">
                  新規登録
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
