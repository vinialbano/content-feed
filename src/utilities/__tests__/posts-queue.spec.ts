jest.mock('ioredis', () => require('ioredis-mock'));

import { PostType } from '../data-fetcher';
import {
  countPostsInQueue,
  dequeuePosts,
  enqueuePosts,
  redis,
} from '../posts-queue';

describe('Posts Queue Operations', () => {
  const mockPosts: PostType[] = [
    {
      id: '1',
      imageUri: 'uri1',
      title: 'Title 1',
      subTitle: 'Subtitle 1',
      body: 'Body 1',
      author: 'Author 1',
      priority: 1,
      publishDate: new Date(),
      comments: [],
    },
    {
      id: '2',
      imageUri: 'uri2',
      title: 'Title 2',
      subTitle: 'Subtitle 2',
      body: 'Body 2',
      author: 'Author 2',
      priority: 2,
      publishDate: new Date(),
      comments: [],
    },
  ];

  beforeEach(async () => {
    await redis.flushall(); // Clear all data in mock Redis before each test
  });

  test('enqueuePosts adds posts to Redis', async () => {
    await enqueuePosts(mockPosts);
    const queueLength = await redis.llen('posts');
    expect(queueLength).toBe(mockPosts.length);
  });

  test('countPostsInQueue returns the correct number of posts', async () => {
    await enqueuePosts(mockPosts);

    const count = await countPostsInQueue();
    expect(count).toBe(mockPosts.length);
  });

  test('dequeuePosts retrieves and removes the specified number of posts from the queue', async () => {
    await enqueuePosts(mockPosts);

    const dequeuedPosts = await dequeuePosts(1);
    expect(dequeuedPosts.length).toBe(1);
    expect(dequeuedPosts[0].id).toBe(mockPosts[0].id);

    const remainingCount = await countPostsInQueue();
    expect(remainingCount).toBe(mockPosts.length - 1);
  });

  test('dequeuePosts retrieves and removes the total number of posts from the queue if queue is too small', async () => {
    await enqueuePosts(mockPosts);

    const dequeuedPosts = await dequeuePosts(10);
    expect(dequeuedPosts.length).toBe(2);
    expect(dequeuedPosts[0].id).toBe(mockPosts[0].id);
    expect(dequeuedPosts[1].id).toBe(mockPosts[1].id);

    const remainingCount = await countPostsInQueue();
    expect(remainingCount).toBe(0);
  });
});
