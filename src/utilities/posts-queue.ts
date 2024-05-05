import Redis from 'ioredis';
import { PostType } from './data-fetcher';
import { dateReviver } from './format-date';

export const redis = new Redis({
  host: 'redis',
});

const QUEUE_NAME = 'posts';

export async function enqueuePosts(posts: PostType[]): Promise<void> {
  for (const post of posts) {
    await redis.rpush(QUEUE_NAME, JSON.stringify(post));
  }
}

export async function countPostsInQueue(): Promise<number> {
  return await redis.llen(QUEUE_NAME);
}

export async function dequeuePosts(count: number): Promise<PostType[]> {
  const pipeline = redis.multi();
  pipeline.lrange(QUEUE_NAME, 0, count - 1);
  pipeline.ltrim(QUEUE_NAME, count, -1);
  const results = await pipeline.exec();
  if (!results) {
    return [];
  }
  const postsData = results[0][1] as string[];
  return postsData.map((data: string) => JSON.parse(data, dateReviver));
}
