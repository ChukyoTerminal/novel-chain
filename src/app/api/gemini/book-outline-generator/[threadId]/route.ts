//ユーザーが小説を書くに当たって，AIが続きを書く際の指針を制作してくれるapi

import { NextRequest, NextResponse } from 'next/server';

import { gemini } from '@/lib/gemini';

const INSTRUCTION_PROMPT_A = `あなたは小説家です.物語の続きを執筆するために,作品を読み,物語の方向性や展開の可能性を示すあらすじを300文字以内で作成してください.
このあらすじは,作者自身が物語の構造やテーマを把握し.続きを書く際の指針となるようにしてください.以下の点を意識してまとめてください：

主人公の目的や葛藤を明示する.
物語の舞台や雰囲気を簡潔に描写する.
今後の展開の可能性や伏線を示唆する.
読者向けではなく、作者自身の創作支援を目的とする.


出力形式は以下の通りです：
{"summary": "ここに300文字以内の創作支援用あらすじを記述"}`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId : string }> }// thread_IDの取得
){
  try{
    const { threadId } = await params;

    const msResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini/to-make-JSON/${threadId}`
    );

    if (!msResponse.ok) {
      return new Response('Failed to fetch posts', { status: 500 });
    }

    const msData = await msResponse.json();
    const content = msData.summary;

    //文書Aと文書Bを組み合わせてAIに送信
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const finalPrompt = `${INSTRUCTION_PROMPT_A}\n\n小説本文:\n${content}`;

    //出力テキストの取得
    const result = await model.generateContent(finalPrompt);
    const responseText = result.response.text();

    //JSONファイルのパース
    const summary = JSON.parse(responseText);
    //ここif文つける．

    //JSONファイルを返す．
    return NextResponse.json({
      message: 'Document generated and saved successfully.',
      outline: summary.summary,
      status: 200
    });

  }catch(e){
    console.error('API execution error:', e);
    return NextResponse.json({ error: 'An error occurred while processing the request.', }, { status: 500 })
  }
}
