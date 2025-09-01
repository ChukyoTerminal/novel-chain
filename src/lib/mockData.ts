import {Thread, User , Post} from '@/types';
import {faker} from '@faker-js/faker';

const createMockUser = (): User => {
    return {
        id: faker.string.uuid(),
        name: faker.internet.username(),
        rating: faker.number.int({min:0, max:100}),
        display_name: faker.internet.username(),
        follower_count: faker.number.int({min:0, max:1000}).toString(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
        threads: [],
        posts: []
    };
};

const user1 = createMockUser();
const user2 = createMockUser();
const user3 = createMockUser();

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
        title: "First Thread",
        rating: faker.number.int({min:0, max:100}),
        owner: user1,
        posts: [
            createMockPost(user1, "1"),
            createMockPost(user2, "1"),
            createMockPost(user3, "1"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
        tags: ["tag1", "tag2"]
    },
    {
        id: "2",
        title: "Second Thread",
        rating: faker.number.int({min:0, max:100}),
        owner: user2,
        posts: [
            createMockPost(user2, "2"),
            createMockPost(user3, "2"),
            createMockPost(user1, "2"),
        ],
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
        tags: ["tag3", "tag4"]
    }
];

