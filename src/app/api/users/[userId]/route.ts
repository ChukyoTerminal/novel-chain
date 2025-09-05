import { prisma } from '@/lib/prisma';


export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  // 必要な情報をまとめて取得
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true, // TODO: 本人のみ閲覧可能にする
      name: true,
      displayName: true,
      iconHash: true,
      createdAt: true,
      followers: { select: { id: true } },
      threads: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          tags: {
            select: {
              tag: { select: { name: true } }
            }
          },
          posts: {
            select: {
              ratings: { select: { score: true } }
            }
          }
        }
      },
      posts: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          thread: {
            select: {
              id: true,
              title: true,
              createdAt: true,
              updatedAt: true,
              tags: {
                select: {
                  tag: { select: { name: true } }
                }
              },
              posts: {
                select: {
                  ratings: { select: { score: true } }
                }
              }
            }
          },
          ratings: { select: { score: true } },
          histories: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { content: true }
          }
        }
      }
    }
  });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  // rating（投稿評価合計）
  const userRating = user.posts.reduce((sum, post) => sum + post.ratings.reduce((s, r) => s + r.score, 0), 0);
  // follower_count
  const followerCount = user.followers.length;

  // threadsの整形
  const threads = user.threads.map(thread => {
    const threadRating = thread.posts.reduce((sum, post) => sum + post.ratings.reduce((s, r) => s + r.score, 0), 0);
    return {
      id: thread.id,
      title: thread.title,
      tags: thread.tags.map(t => t.tag.name),
      rating: threadRating,
      created_at: thread.createdAt,
      updated_at: thread.updatedAt
    };
  });

  // postsの整形
  const posts = user.posts.map(post => {
    const postRating = post.ratings.reduce((sum, r) => sum + r.score, 0);
    const thread = post.thread;
    const threadRating = thread.posts.reduce((sum, p) => sum + p.ratings.reduce((s, r) => s + r.score, 0), 0);
    return {
      id: post.id,
      thread: {
        id: thread.id,
        title: thread.title,
        rating: threadRating,
        created_at: thread.createdAt,
        updated_at: thread.updatedAt,
        tags: thread.tags.map(t => t.tag.name)
      },
      content: post.histories[0]?.content ?? '',
      rating: postRating,
      created_at: post.createdAt,
      updated_at: post.updatedAt
    };
  });

  const result = {
    name: user.name,
    rating: userRating,
    display_name: user.displayName ?? '',
    follower_count: followerCount,
    created_at: user.createdAt,
    threads,
    posts
  };

  return new Response(JSON.stringify(result), { status: 200 });
}


export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const body = await request.json();
  const { name, display_name: displayName } = body;

  // ユーザーの存在確認
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
  }

  // ユーザー情報の更新
  await prisma.user.update({
    where: { id: userId },
    data: {
      name: name ?? user.name,
      displayName: displayName ?? user.displayName
    },
    select: {
      id: true,
    },
  });

  return new Response(undefined, { status: 204 });
}
