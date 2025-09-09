'use client'
/* eslint-disable max-len */


import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/inputOtp';
import { useState } from 'react';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { LuBookOpen, LuArrowLeft } from 'react-icons/lu';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { sha256sum } from '@/utils/hash';

async function handleGoogleSignIn() {
  await signIn('google');
  globalThis.location.href = '/';
}

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [code, setCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');

  // 新規登録ボタン押下時
  const handleEmailSignUp = async () => {
    setError('');
    // パスワードをハッシュ
    const hashed = await sha256sum(password);
    setPassword(hashed);

    if (globalThis.window !== undefined) {
      globalThis.window.localStorage.setItem('novelchain_email', email);
    }
    const request = await fetch('/api/auth/email-verification/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (request.ok) {
      setShowVerify(true);
    } else {
      setError('新規登録に失敗しました');
    }
  };

  // 認証コード送信
  const handleVerifyCode = async () => {
    setVerifyError('');
    setVerifySuccess('');
    let emailValue = '';
    if (globalThis.window !== undefined) {
      emailValue = globalThis.window.localStorage.getItem('novelchain_email') || '';
    }
    const response = await fetch('/api/auth/email-verification/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailValue, code }),
    });
    const token = await response.json();
    if (response.ok) {
      setVerifySuccess('認証が完了しました！');
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, ticket : token.ticket, name: username, password_hash: password }),
      });

      // 認証後にログインも実行
      await signIn('credentials', {
        email: emailValue,
        password,
        redirect: false,
      });
      globalThis.location.href = '/';
    } else {
      setVerifyError(token.error || '認証に失敗しました');
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
      <main className="max-w-md mx-auto px-4 py-16">
        {!showVerify ? (
          <Card className="p-6">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">新規登録</CardTitle>
              <CardDescription>
                NovelChainでリレー小説を始めましょう
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="ユーザー名"
                  className="border rounded px-4 py-2"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
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
                  minLength={8}
                />
                <Button onClick={handleEmailSignUp} className="w-full" variant="outline">
                  メールで新規登録
                </Button>
                <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24" className="inline-block mr-2 align-middle"><path fill="#4285F4" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.22l6.9-6.9C36.36 2.34 30.55 0 24 0 14.61 0 6.27 5.7 2.13 14.1l8.06 6.27C12.6 13.16 17.87 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.18 5.36-4.64 7.02l7.18 5.59C43.73 37.16 46.1 31.3 46.1 24.5z"/><path fill="#FBBC05" d="M10.19 28.37c-1.13-3.36-1.13-6.97 0-10.33l-8.06-6.27C.7 16.61 0 20.19 0 24c0 3.81.7 7.39 2.13 10.23l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.55 0 12.36-2.16 16.98-5.89l-7.18-5.59c-2.01 1.35-4.59 2.15-7.3 2.15-6.13 0-11.4-3.66-13.81-8.87l-8.06 6.27C6.27 42.3 14.61 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                  Googleでサインイン
                </Button>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </div>
              <div className="text-center mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600">
                  既にアカウントをお持ちですか？{' '}
                  <Link href="/auth/login" className="text-blue-600 hover:underline">
                    ログイン
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-6">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">メール認証</CardTitle>
              <CardDescription>
                メールアドレスに送信された認証コードを入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <>
                  <InputOTP maxLength={8} value={code} onChange={setCode} className="mx-auto">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator/>
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button onClick={handleVerifyCode} className="w-full mt-4" variant="outline">
                    コードを認証
                  </Button>
                </>
                {verifyError && <div className="text-red-500 text-sm mt-2">{verifyError}</div>}
                {verifySuccess && <div className="text-green-600 text-sm mt-2">{verifySuccess}</div>}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
