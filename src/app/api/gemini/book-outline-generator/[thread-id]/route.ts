//databaseとの連携をまだ行っていない
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 



//複数の投稿をまとめて一つのＪＳＯＮファイルで送ったほうがいい気がする．
//ここで問題発生，thread_IDから投稿をどのようにサーチをサーチするのか？


const INSTRUCTION_PROMPT_A = 'あなたは小説家です.物語の続きを執筆するために,作品を読み,物語の方向性や展開の可能性を示すあらすじを300文字以内で作成してください.'
+'このあらすじは,作者自身が物語の構造やテーマを把握し.続きを書く際の指針となるようにしてください.以下の点を意識してまとめてください：'
+'\n主人公の目的や葛藤を明示する.\n物語の舞台や雰囲気を簡潔に描写する.\n今後の展開の可能性や伏線を示唆する.\n読者向けではなく、作者自身の創作支援を目的とする.'
+'\n\n出力形式は以下の通りです：\n{"summary": "ここに300文字以内の創作支援用あらすじを記述"}';

// APIkey セット
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set.');
}
const genAI = new GoogleGenerativeAI(API_KEY); // generative AI クライアントのインスタンス

export async function GET(
  request: NextRequest,
  { params }: { params: {  thread_ID : string } }// thread_IDの取得
){
    try{
        const thread_ID = params;

        //fetchのURLあっているかどうか？
        //databaseでSQLで行うらしい
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
        const summary = JSON.parse(responseText);
        //ここif文つける．

        //JSONファイルを返す．
        return NextResponse.json({
            message: 'Document generated and saved successfully.',
            outline: summary.summary,
            status: 200
        });

    }catch(error){
        console.error('API execution error:', error);
        return NextResponse.json({error: 'An error occurred while processing the request.',}, { status: 500 })
    }
}