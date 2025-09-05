/**
 * SHA-1ハッシュを生成する。
 * @param input - ハッシュ化する文字列
 * @returns SHA-1ハッシュ
 */
export async function sha1sum(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data); // eslint-disable-line sonarjs/hashing
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


/**
 * SHA-256ハッシュを生成する。
 * @param input - ハッシュ化する文字列
 * @returns SHA-256ハッシュ
 */
export async function sha256sum(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = [...new Uint8Array(hashBuffer)];
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
