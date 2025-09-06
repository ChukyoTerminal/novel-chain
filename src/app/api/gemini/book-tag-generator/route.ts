//databaseとの連携をまだ行っていない
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 



//複数の投稿をまとめて一つのＪＳＯＮファイルで送ったほうがいい気がする．
//ここで問題発生，thread_IDから投稿をどのようにサーチをサーチするのか？


const INSTRUCTION_PROMPT_A ='あなたは出版社の編集者です。あなたの仕事は、小説コンテストに応募された作品の冒頭を読み、その小説に適したジャンルのタグを付けることです。使用できるタグは次の6種類のみです：ミステリー, ファンタジー, SF, 恋愛, ホラー, ライトノベル。タグは1〜3個選んでください。\n出力は必ずJSON形式とし、余計な文章を含めないでください。出力例：{"tags": ["SF", "恋愛"]}';

// APIkey セット
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set.');
}
const genAI = new GoogleGenerativeAI(API_KEY); // generative AI クライアントのインスタンス

export async function PUT(
  request: NextRequest,
  { params }: { params: {  thread_ID : string } }// thread_IDの取得
){
    try{
        const thread_ID = params;

        //fetchのURLあっているかどうか？
        //小説の本文をPROMPT_Bに入れる．
        const mj = await fetch('/api/gemini/to-make-JSON/${thread_ID}',/*未完*/);
        // mjにはJSON形式なる予定
        const PROMPT_B = await ;

        //文書Aと文書Bを組み合わせてAIに送信
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const fullPrompt = `${INSTRUCTION_PROMPT_A}\n\n小説本文:\n${PROMPT_B}`;

        //出力テキストの取得
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        //JSONファイルのパース
        const tag = JSON.parse(responseText);
        //ここif文つける．
        


         
    return NextResponse.json({message: 'Document generated and saved successfully.'}, { status: 200 });    

    }catch(error){
        console.error('API execution error:', error);
        return NextResponse.json({error: 'An error occurred while processing the request.',}, { status: 500 })
    }
}