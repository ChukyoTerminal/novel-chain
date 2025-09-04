import {Thread, User , Post} from '@/types';
import {faker} from '@faker-js/faker';

const createMockUser = (): User => {
    const username = faker.internet.username();
    return {
        id: faker.string.uuid(),
        name: username,
        email: faker.internet.email(),
        avatarUrl: faker.image.avatar(),
        rating: faker.number.int({min:0, max:100}),
        display_name: faker.internet.username(),
        follower_count: faker.number.int({min:0, max:1000}).toString(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
        threads: [],
        posts: []
    };
};

export const testUser = createMockUser();
testUser.email = "test@example.com";
testUser.display_name = "テストユーザー";

const user1 = createMockUser();
const user2 = createMockUser();
const user3 = createMockUser();
const user4 = createMockUser();
const user5 = createMockUser();
const user6 = createMockUser();
const user7 = createMockUser();
const user8 = createMockUser();

// 更に具体的なユーザー名を設定
user1.display_name = "作家太郎";
user2.display_name = "小説花子";
user3.display_name = "創作次郎";
user4.display_name = "文学美";
user5.display_name = "ファンタジー王";
user6.display_name = "恋愛作家";
user7.display_name = "SF博士";
user8.display_name = "歴史小説家";

const createMockPost = (author: User, thread_id: string): Post => {
    return {
        id: faker.string.uuid(),
        thread_id: thread_id,
        content: faker.lorem.paragraphs(5),
        author: author,
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    };
};

export const mockThreads: Thread[] = [
    {
        id: "1",
        title: "魔法学園の日常",
        rating: 95,
        owner: user1,
        tags: ["ファンタジー", "ライトノベル"],
        summary: "平凡な少年が魔法学園に入学し、仲間たちと共に成長していく物語。日常の中にも小さな冒険が隠れており、友情と青春を描いた心温まる作品です。",
        posts: [
            createMockPost(user1, "1"),
            createMockPost(user2, "1"),
            createMockPost(user3, "1"),
            createMockPost(user4, "1"),
            createMockPost(user5, "1"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "2",
        title: "星の向こうへ",
        rating: 88,
        owner: user7,
        tags: ["SF"],
        summary: "2150年、人類は他の惑星への移住を開始していた。宇宙船クルーとして新たな惑星を探索する主人公の壮大な冒険記。未知の生命体との出会いと別れを描く。",
        posts: [
            createMockPost(user7, "2"),
            createMockPost(user3, "2"),
            createMockPost(user1, "2"),
            createMockPost(user8, "2"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "3",
        title: "桜舞う季節に",
        rating: 92,
        owner: user6,
        tags: ["恋愛", "ライトノベル"],
        summary: "高校3年生の春、転校生として現れた彼女に恋をした主人公。卒業までの短い時間の中で紡がれる純愛ストーリー。桜の季節に始まり、桜の季節に終わる美しい物語。",
        posts: [
            createMockPost(user6, "3"),
            createMockPost(user2, "3"),
            createMockPost(user4, "3"),
            createMockPost(user1, "3"),
            createMockPost(user5, "3"),
            createMockPost(user3, "3"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "4",
        title: "戦国武将異聞録",
        rating: 85,
        owner: user8,
        tags: ["ファンタジー"],
        summary: "織田信長に仕えた架空の武将の物語。史実とフィクションを織り交ぜながら、戦国時代の激動を描く。忠義と野望、愛と憎しみが交錯する歴史絵巻。",
        posts: [
            createMockPost(user8, "4"),
            createMockPost(user1, "4"),
            createMockPost(user7, "4"),
            createMockPost(user3, "4"),
            createMockPost(user5, "4"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "5",
        title: "異世界カフェ物語",
        rating: 79,
        owner: user2,
        tags: ["ファンタジー", "ライトノベル"],
        summary: "異世界に召喚された主人公が開いたカフェ。この世界にはない料理とコーヒーで、様々な種族のお客様をもてなす心温まる日常系ファンタジー。",
        posts: [
            createMockPost(user2, "5"),
            createMockPost(user4, "5"),
            createMockPost(user6, "5"),
            createMockPost(user1, "5"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "6",
        title: "闇夜に潜む者",
        rating: 91,
        owner: user3,
        tags: ["ホラー", "ミステリー"],
        summary: "平和な町で連続して起こる怪奇現象。新聞記者の主人公が真相を追う中で明かされる恐ろしい真実。読者を最後まで惹きつける本格ホラーサスペンス。",
        posts: [
            createMockPost(user3, "6"),
            createMockPost(user7, "6"),
            createMockPost(user8, "6"),
            createMockPost(user2, "6"),
            createMockPost(user5, "6"),
            createMockPost(user4, "6"),
            createMockPost(user1, "6"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "7",
        title: "竜と共に歩む道",
        rating: 87,
        owner: user5,
        tags: ["ファンタジー"],
        summary: "竜と契約した少女が世界を救う旅に出る王道ファンタジー。仲間たちとの絆を深めながら、古代の邪悪な存在に立ち向かう壮大な冒険譚。",
        posts: [
            createMockPost(user5, "7"),
            createMockPost(user1, "7"),
            createMockPost(user3, "7"),
            createMockPost(user6, "7"),
            createMockPost(user2, "7"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "8",
        title: "都市伝説の真相",
        rating: 83,
        owner: user4,
        tags: ["ミステリー"],
        summary: "巷で噂される都市伝説の真相を探る大学生グループの物語。調査を進めるうちに浮かび上がる意外な事実と、隠された陰謀に迫るミステリー。",
        posts: [
            createMockPost(user4, "8"),
            createMockPost(user2, "8"),
            createMockPost(user7, "8"),
            createMockPost(user1, "8"),
            createMockPost(user8, "8"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "9",
        title: "時を超えた恋人",
        rating: 90,
        owner: user6,
        tags: ["恋愛", "SF"],
        summary: "偶然手に入れた古い時計により時間旅行ができるようになった主人公。過去で出会った恋人との時代を超えた愛を描くSFロマンス。",
        posts: [
            createMockPost(user6, "9"),
            createMockPost(user5, "9"),
            createMockPost(user3, "9"),
            createMockPost(user8, "9"),
            createMockPost(user1, "9"),
            createMockPost(user4, "9"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "10",
        title: "機械仕掛けの少女",
        rating: 86,
        owner: user7,
        tags: ["SF"],
        summary: "人工知能を持つアンドロイドが自我に目覚める物語。人間とは何か、心とは何かを問いかける哲学的なSF作品。技術と感情の境界線を探る。",
        posts: [
            createMockPost(user7, "10"),
            createMockPost(user4, "10"),
            createMockPost(user2, "10"),
            createMockPost(user6, "10"),
            createMockPost(user1, "10"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "11",
        title: "猫カフェの秘密",
        rating: 82,
        owner: user2,
        tags: ["ライトノベル"],
        summary: "街角の小さな猫カフェを舞台にした心温まるコメディ。実は特別な能力を持つ猫たちと、それを知らずに働く店員の日常を描く。",
        posts: [
            createMockPost(user2, "11"),
            createMockPost(user1, "11"),
            createMockPost(user5, "11"),
            createMockPost(user3, "11"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    },
    {
        id: "12",
        title: "忘れられた王国",
        rating: 94,
        owner: user8,
        tags: ["ファンタジー"],
        summary: "滅びたはずの古代王国の遺跡で目覚めた王子が、現代で王国の復活を目指す壮大なファンタジー。政治的な駆け引きと魔法が織りなす重厚な物語。",
        posts: [
            createMockPost(user8, "12"),
            createMockPost(user5, "12"),
            createMockPost(user1, "12"),
            createMockPost(user7, "12"),
            createMockPost(user3, "12"),
            createMockPost(user4, "12"),
            createMockPost(user6, "12"),
            createMockPost(user2, "12"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    }
];

