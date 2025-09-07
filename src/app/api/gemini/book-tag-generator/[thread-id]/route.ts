//threadに対してtag付けを行うAI
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

//tagの信頼度順につける機能が欲しい．
//もっとも古い更新が信頼度が高いでいいかも？

const INSTRUCTION_PROMPT_A ='あなたは出版社の編集者です。あなたの仕事は、小説コンテストに応募された作品の冒頭を読み、その小説に適したジャンルのタグを付けることです。'
+'使用できるタグは次の6種類のみです：ミステリー, ファンタジー, SF, 恋愛, ホラー, ライトノベル。タグは1〜3個選んでください。'
+'\n出力は必ずJSON形式とし、余計な文章を含めないでください。出力例：{"tags": ["SF", "恋愛"]}';

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
        const parsedTags = JSON.parse(responseText) as {tags : string[]};
        //ここif文つける．
        
        const tagNamesFromAI = parsedTags.tags;

        //tag tableから複数のレコードを取得する． 条件として，nameがt.tagsのうちのどれかに一致
        const existingtags = await prisma.tag.findMany({
          where: {
            name: { in : tagNamesFromAI}
          },
          select: {
            id:true,
            name: true,
          }
        });

        await prisma.$transaction(async (tx)=>{
          //既存のレコードを削除
          await tx.threadTag.deleteMany({
            where: {
              threadId: thread_ID,
            },
          });

          //新しい関連データを作成
          const newThreadTagsDatas = existingtags.map(tag =>({
            threadId: thread_ID,
            tagId: tag.id,
          }))
          //更新
          await tx.threadTag.createMany({
           data: newThreadTagsDatas, 
          });
        });
         
    return NextResponse.json({message: 'Document generated and saved successfully.'}, { status: 200 });    

    }catch(error){
        console.error('API execution error:', error);
        return NextResponse.json({error: 'An error occurred while processing the request.',}, { status: 500 })
    }
}