'use server';

import bcrypt from 'bcrypt';

/**
 * 文字列を受け取りbcryptハッシュを返す
 *
 * @param password - プレーンなパスワード文字列

/** * パスワードとハッシュを受け取り照合する
 *
 * @param password - パスワードのSHA-256ハッシュ
 * @param hash - bcryptハッシュ
 * @returns 照合結果 (true: 一致, false: 不一致)
 */
export async function matchPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}


/**
 * 文字列を受け取りbcryptハッシュを返す
 *
 * @param password - パスワードのSHA-256ハッシュ
 * @returns bcryptハッシュ
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
