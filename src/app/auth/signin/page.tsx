'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LuBookOpen, LuArrowLeft } from "react-icons/lu";
import Link from "next/link";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    userId: '',
    displayName: '',
    email: '',
    password: '',
    birthDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 新規登録処理（未実装）
    console.log('Sign up data:', formData);
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
            <CardTitle className="text-2xl">新規登録</CardTitle>
            <CardDescription>
              NovelChainでリレー小説を始めましょう
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ユーザーID */}
              <div>
                <Label htmlFor="userId">ユーザーID *</Label>
                <Input
                  id="userId"
                  name="userId"
                  type="text"
                  value={formData.userId}
                  onChange={handleInputChange}
                  placeholder="ユーザーIDを入力"
                  required
                />
              </div>

              {/* 表示名 */}
              <div>
                <Label htmlFor="displayName">表示名 *</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="表示名を入力"
                  required
                />
              </div>

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

              {/* 生年月日 */}
              <div>
                <Label htmlFor="birthDate">生年月日 *</Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* 登録ボタン */}
              <Button type="submit" className="w-full mt-6">
                アカウントを作成
              </Button>
            </form>

            {/* ログインリンク */}
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
      </main>
    </div>
  );
}
