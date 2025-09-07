//本の表紙に乗せる小説の紹介文を生成するapi

import { NextRequest, NextResponse } from 'next/server';
import { gemini } from '@/lib/gemini';
import { prisma } from '@/lib/prisma'; 

const INSTRUCTION_PROMPT_A = `あなたは出版社の編集者です.担当している作家の作品を読み、読者の興味を引く魅力的なあらすじを300文字以内で作成してください。
あらすじは以下の条件を満たすようにしてください：
物語のジャンルや雰囲気が伝わるようにする.主人公の状況や物語の導入部を簡潔に描写する. 読者の好奇心を刺激するような言葉選びを心がける.
結末やネタバレは含めない出力は必ず以下の形式で返してください（余計な文章は含めないこと）：
{"summary": "ここに300文字以内のあらすじを記述"}`;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ threadId : string }> }// thread_IDの取得
){
  try{
    const { threadId } = await params;

    // fetch用の絶対URLを生成
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const fetchUrl = `${baseUrl}/api/gemini/to-make-JSON/${threadId}`;
    console.log('[DEBUG] fetchUrl:', fetchUrl);
    const msResponse = await fetch(fetchUrl);
    console.log('[DEBUG] msResponse status:', msResponse.status);
    if (!msResponse.ok) {
      console.error('[ERROR] Failed to fetch posts', await msResponse.text());
      return new Response('Failed to fetch posts', { status: 500 });
    }
    const msData = await msResponse.json();
    console.log('[DEBUG] msData:', msData);
    const PROMPT_B = msData.mergedContent ?? '';
    if (!PROMPT_B || PROMPT_B.trim() === '') {
      console.error('[ERROR] mergedContent is empty, skipping AI request');
      return NextResponse.json({ error: 'No content to summarize.' }, { status: 400 });
    }

    //文書Aと文書Bを組み合わせてAIに送信
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const fullPrompt = `${INSTRUCTION_PROMPT_A}\n\n小説本文:\n${PROMPT_B}`;

    //出力テキストの取得
    const result = await model.generateContent(fullPrompt);
    let responseText = result.response.text();
    console.log('[DEBUG] AI responseText:', responseText);
    // 余計なバッククォートや```jsonなどを除去
    responseText = responseText.replace(/^[`\s]*json\s*/i, '').replaceAll('```', '').trim();

    //JSONファイルのパース
    let summary;
    try {
      summary = JSON.parse(responseText);
    } catch (e) {
      console.error('[ERROR] JSON.parse failed', responseText, e);
      return NextResponse.json({ error: 'AI response is not valid JSON.' }, { status: 500 });
    }

    await prisma.thread.update({
      where: {
        id: threadId
      },        
      data: {
        summary: summary.summary.toString()//ここは文字列を渡す．
      },
    });
         
    return NextResponse.json({ message: 'Document generated and saved successfully.' }, { status: 200 });    

  }catch(e){
    console.error('API execution error:', e);
    return NextResponse.json({ error: 'An error occurred while processing the request.', }, { status: 500 })
  }
}
