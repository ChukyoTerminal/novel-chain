import { sha1sum } from './hash';


/**
 * 一時的なユーザー名を生成する。
 *
 * @param input - ユーザー名の元になる文字列
 * @returns 一時的なユーザー名
 */
export async function getTemporaryUserName(input: string): Promise<string> {
  const hash = await sha1sum(input);
  return `user_${hash.slice(0, 8)}`;
}
