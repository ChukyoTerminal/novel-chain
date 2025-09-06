'use server';

import bcrypt from 'bcrypt';

/**
 * 文字列を受け取りbcryptハッシュを返す
 *
 * @param password - プレーンなパスワード文字列
 * @returns bcryptハッシュ
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
