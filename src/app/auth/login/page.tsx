'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuBookOpen, LuArrowLeft } from "react-icons/lu";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/');
      } else {
        alert('ログインに失敗しました。メールアドレスまたはパスワードを確認してください。');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('ログインエラーが発生しました。');
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* メールアドレス */}
              <div>
                <Label htmlFor="email">メールアドレス *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="メールアドレスを入力"
                  required
                />
              </div>

              {/* パスワード */}
              <div>
                <Label htmlFor="password">パスワード *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="パスワードを入力"
                  required
                />
              </div>

              {/* ログインボタン */}
              <Button type="submit" className="w-full mt-6">
                ログイン
              </Button>
            </form>

            {/* パスワードを忘れた場合のリンク */}
            <div className="text-center mt-4">
              <Link href="#" className="text-sm text-blue-600 hover:underline">
                パスワードを忘れた場合
              </Link>
            </div>

            {/* 新規登録リンク */}
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
