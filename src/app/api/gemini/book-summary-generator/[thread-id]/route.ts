//databaseとの連携をまだ行っていない
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 



//複数の投稿をまとめて一つのＪＳＯＮファイルで送ったほうがいい気がする．
//ここで問題発生，thread_IDから投稿をどのようにサーチをサーチするのか？


const INSTRUCTION_PROMPT_A = 'あなたは出版社の編集者です.担当している作家の作品を読み、読者の興味を引く魅力的なあらすじを300文字以内で作成してください.'
+'あらすじは以下の条件を満たすようにしてください：'
+'物語のジャンルや雰囲気が伝わるようにする.主人公の状況や物語の導入部を簡潔に描写する. 読者の好奇心を刺激するような言葉選びを心がける. '
+'結末やネタバレは含めない出力は必ず以下の形式で返してください（余計な文章は含めないこと）：'
+'{"summary": "ここに300文字以内のあらすじを記述"}';

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

        
        const PROMPT_B = mj.;

        //文書Aと文書Bを組み合わせてAIに送信
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const fullPrompt = `${INSTRUCTION_PROMPT_A}\n\n小説本文:\n${PROMPT_B}`;

        //出力テキストの取得
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        //JSONファイルのパース
        const summary = JSON.parse(responseText);
        //ここif文つける．

        const updatedPost = await prisma.thread.update({
        where: {
            id: thread_ID.thread_ID //なんかわからんが，ここはobjectを渡す．
        },        
        data: {
            summary: summary.summary.toString()//ここは文字列を渡す．
        },
});
         
    return NextResponse.json({message: 'Document generated and saved successfully.'}, { status: 200 });    

    }catch(error){
        console.error('API execution error:', error);
        return NextResponse.json({error: 'An error occurred while processing the request.',}, { status: 500 })
    }
}
