//ユーザーが書いているtextを受け取り，それをもとに対して続きを生成するapi
import { NextRequest, NextResponse } from 'next/server';

import { gemini } from '@/lib/gemini';

const INSTRUCTION_PROMPT_A = String.raw`
あなたは小説家です。以下の小説を読んで、小説の続きの一文を書いてください。
以下の点に注意して執筆してください。
登場人物の行動がその登場人物の性格や目的に当てはまるのかを考慮する。
物語のストーリーが突然飛躍しないようにする。
人間が読みやすいように適切に改行 "\n" を入れる。
出力形式は以下の通りです：
{"story": "ここに小説の続きを記述"}
`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { userText } = await request.json();
    const { threadId } = await params;

    //実際ここの部分未完成である．/api/threads/[threadId]/postsを使う予定
    // 小説本文を取得
    const msResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini/to-make-JSON/${threadId}`
    );

    if (!msResponse.ok) {
      return new Response('Failed to fetch posts', { status: 500 });
    }

    const msData = await msResponse.json();
    const PROMPT_B = msData.mergedContent;

    // AIに送信するプロンプト
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const fullPrompt = `${INSTRUCTION_PROMPT_A}\n\n小説本文:\n${PROMPT_B}\n${userText}`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    // JSONパース
    const story = JSON.parse(responseText);

    return NextResponse.json(
      {
        message: 'Document generated and saved successfully.',
        story: story.story
      },
      { status: 200 }
    );
  } catch (e) {
    console.error('API execution error:', e);
    return NextResponse.json(
      { error: 'An error occurred while processing the request.' },
      { status: 500 }
    );
  }
}
