import { NextResponse, NextRequest } from "next/server";
import { mockThreads } from "@/lib/mockData";

export async function GET(request:NextRequest,{params}: {params: {thread_id: string, limit?:number, offset?:number}}) {
    const {thread_id} = await params;
    const thread = mockThreads.find(t => t.id === thread_id);
    
    if (thread) {
        const searchParams = request.nextUrl.searchParams;
        const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;
        const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : 0;
        const posts = thread.posts.slice(offset, offset + limit);

        return NextResponse.json({
            posts: posts,
        })
    }
}