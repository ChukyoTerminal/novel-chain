//更新されていないthreadに対して新しいPostを追加するapi

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

//改善必須  AIにキャラクタをつけての投稿できるように
//Postの作成は直接データベースを書く感じ


const INSTRUCTION_PROMPT_A = 'あなたは小説家です.以下の小説を読んで,小説の続き400文字ほどを書いてください.'
+'以下の点に注意して執筆してください.'
+'登場人物の行動がその登場人物の性格や目的に当てはまるのかを考慮する.'
+'物語のストーリが突然飛躍しないでください．'
+'人間が読みやすいように適切に改行"\n"を入れてください．'
+'出力形式は以下の通りです：'
+'{"story": "ここに400文字ほど小説のを記述" ';

// APIkey セット
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set.');
}
const genAI = new GoogleGenerativeAI(API_KEY); // generative AI クライアントのインスタンス

export async function POST(
  request: NextRequest,
  { params }: { params: Promise <{  thread_ID : string }> }// thread_IDの取得
){
    try{
        const requestbody = await params;
        const thread_ID = requestbody.thread_ID;

        //fetchのURLあっているかどうか？
        //小説の本文をPROMPT_Bに入れる．
        const msRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/gemini/to-make-JSON/${thread_ID}`
        );
        const msData = await;
        const PROMPT_B = msData.summary;

        //文書Aと文書Bを組み合わせてAIに送信
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const fullPrompt = `${INSTRUCTION_PROMPT_A}\n\n小説本文:\n${PROMPT_B}`;

        //出力テキストの取得
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        //JSONファイルのパース
        const stroy = JSON.parse(responseText);
        //ここif文つける．

        //投稿が行われる．投稿のAPIを利用する．それとAI用のアカウントとか作る，

         
    return NextResponse.json({message: 'Document generated and saved successfully.'}, { status: 200 });    

    }catch(error){
        console.error('API execution error:', error);
        return NextResponse.json({error: 'An error occurred while processing the request.',}, { status: 500 })
    }
}
