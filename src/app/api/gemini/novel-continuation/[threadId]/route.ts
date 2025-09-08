//更新されていないthreadに対して新しいPostを追加するapi

import { NextRequest, NextResponse } from 'next/server';

import { gemini } from '@/lib/gemini';

//改善必須  AIにキャラクタをつけての投稿できるように
//Postの作成は直接データベースを書く感じ


const INSTRUCTION_PROMPT_A = 'あなたは小説家です.以下の小説を読んで,小説の続き500文字以下で書いてください.'
+'以下の点に注意して執筆してください.'
+'登場人物の行動がその登場人物の性格や目的に当てはまるのかを考慮する.'
+'物語のストーリーが突然飛躍しないでください．'
+'人間が読みやすいように適切に改行"\n"を入れてください．'
+'出力形式は以下の通りです：'
+'{"story": "ここに500文字以下の小説を記述" ';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId : string }> }// threadIdの取得
){
  try{
    const { threadId } = await params;

    //fetchのURLあっているかどうか？
    //小説の本文をPROMPT_Bに入れる．
    const msResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini/to-make-JSON/${threadId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!msResponse.ok) {
      return new Response('Failed to fetch posts', { status: 500 });
    }

    const msData = await msResponse.json();
    const PROMPT_B = msData.mergedContent;

    //文書Aと文書Bを組み合わせてAIに送信
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const fullPrompt = `${INSTRUCTION_PROMPT_A}\n\n小説本文:\n${PROMPT_B}`;

    //出力テキストの取得
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    //JSONファイルのパース
    const story = JSON.parse(responseText);
    
    if (!(story && typeof story === 'object' && story.hasOwnProperty('story') && typeof story.story === 'string')) {
      return NextResponse.json({ error: 'An error occurred while processing the request.', }, { status: 500 })
    }

    //投稿が行われる．投稿のAPIを利用する．それとAI用のアカウントとか作る，

         
    return NextResponse.json({ message: 'Document generated and saved successfully.' }, { status: 200 });    

  }catch(e){
    console.error('API execution error:', e);
    return NextResponse.json({ error: 'An error occurred while processing the request.', }, { status: 500 })
  }
}
