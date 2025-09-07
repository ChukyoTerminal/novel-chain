 
'use client'

import { useState } from 'react';
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { LuBookOpen, LuArrowLeft } from 'react-icons/lu';
import Link from 'next/link';

export default function VerifyPage() {
  // コード入力と認証のみ
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // コード認証
  const handleVerifyCode = async () => {
    setError('');
    setSuccess('');
    // localStorageからメールアドレス取得
    let email = '';
    if (globalThis.window !== undefined) {
      email = globalThis.window.localStorage.getItem('novelchain_email') || '';
    }
    const response = await fetch('/api/auth/email-verification/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await response.json();
    if (response.ok) {
      setSuccess('認証が完了しました！');
      // 認証後の遷移など必要ならここで
    } else {
      setError(data.error || '認証に失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                  認証コードを認証
                </Button>
              </>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}