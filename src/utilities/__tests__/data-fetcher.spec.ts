import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchAndStorePosts,
  getBatchOfPosts,
  parseAndSortPosts,
  parseCommentData,
  parsePostData,
} from '../data-fetcher';
import * as postsQueue from '../posts-queue';
jest.mock('../posts-queue', () => ({
  __esModule: true,
  enqueuePosts: jest.fn().mockResolvedValue(undefined),
  countPostsInQueue: jest.fn().mockResolvedValue(11),
  dequeuePosts: jest.fn().mockResolvedValue(
    Array(10).fill({
      id: '001',
      imageUri: 'url-to-image',
      title: 'Post Title',
      subTitle: 'Post SubTitle',
      body: 'Post Body',
      author: 'Jane Doe',
      priority: 1,
      publishDate: new Date('2021-01-01T00:00:00.000Z'),
      comments: [
        {
          body: 'Great read!',
          author: 'Alice',
          profilePic: 'url-to-image',
          likes: 5,
        },
      ],
    }),
  ),
}));

describe('Data Fetcher', () => {
  describe('Data Parsing Functions', () => {
    it('should correctly parse comment data', () => {
      const inputComment = {
        text: 'Nice post!',
        author: 'John Doe',
        profilePic: 'url-to-image',
        likes: 10,
      };
      const expected = {
        body: 'Nice post!',
        author: 'John Doe',
        profilePic: 'url-to-image',
        likes: 10,
      };
      expect(parseCommentData(inputComment)).toEqual(expected);
    });

    it('should correctly parse post data', () => {
      const inputPost = {
        id: '001',
        imageUri: 'url-to-image',
        textData: {
          title: 'Post Title',
          subTitle: 'Post SubTitle',
          body: 'Post Body',
          author: {
            first: 'Jane',
            last: 'Doe',
          },
        },
        metadata: {
          priority: 1,
          publishDate: '2021-01-01T00:00:00.000Z',
        },
        comments: [
          {
            text: 'Great read!',
            author: 'Alice',
            profilePic: 'url-to-image',
            likes: 5,
          },
        ],
      };
      const expected = {
        id: '001',
        imageUri: 'url-to-image',
        title: 'Post Title',
        subTitle: 'Post SubTitle',
        body: 'Post Body',
        author: 'Jane Doe',
        priority: 1,
        publishDate: new Date('2021-01-01T00:00:00.000Z'),
        comments: [
          {
            body: 'Great read!',
            author: 'Alice',
            profilePic: 'url-to-image',
            likes: 5,
          },
        ],
      };
      expect(parsePostData(inputPost)).toEqual(expected);
    });

    it('should parse and sort posts by priority', () => {
      const input = {
        contentCards: [
          {
            id: '001',
            imageUri: 'url-to-image',
            textData: {
              title: 'Post Title',
              subTitle: 'Post SubTitle',
              body: 'Post Body',
              author: {
                first: 'Jane',
                last: 'Doe',
              },
            },
            metadata: {
              priority: 1,
              publishDate: '2021-01-01T00:00:00.000Z',
            },
            comments: [
              {
                text: 'Great read!',
                author: 'Alice',
                profilePic: 'url-to-image',
                likes: 5,
              },
            ],
          },
          {
            id: '002',
            imageUri: 'url-to-image',
            textData: {
              title: 'Post Title',
              subTitle: 'Post SubTitle',
              body: 'Post Body',
              author: {
                first: 'John',
                last: 'Doe',
              },
            },
            metadata: {
              priority: 2,
              publishDate: '2022-01-01T00:00:00.000Z',
            },
            comments: [
              {
                text: 'Great read!',
                author: 'Bob',
                profilePic: 'url-to-image',
                likes: 5,
              },
            ],
          },
        ],
      };

      const expected = [
        {
          id: '002',
          imageUri: 'url-to-image',
          title: 'Post Title',
          subTitle: 'Post SubTitle',
          body: 'Post Body',
          author: 'John Doe',
          priority: 2,
          publishDate: new Date('2022-01-01T00:00:00.000Z'),
          comments: [
            {
              body: 'Great read!',
              author: 'Bob',
              profilePic: 'url-to-image',
              likes: 5,
            },
          ],
        },
        {
          id: '001',
          imageUri: 'url-to-image',
          title: 'Post Title',
          subTitle: 'Post SubTitle',
          body: 'Post Body',
          author: 'Jane Doe',
          priority: 1,
          publishDate: new Date('2021-01-01T00:00:00.000Z'),
          comments: [
            {
              body: 'Great read!',
              author: 'Alice',
              profilePic: 'url-to-image',
              likes: 5,
            },
          ],
        },
      ];

      expect(parseAndSortPosts(input)).toEqual(expected);
    });
  });

  describe('Post Fetching and Handling', () => {
    const mock = new MockAdapter(axios);

    beforeEach(() => {
      mock.resetHistory();
      mock.onGet(process.env.CONTENT_API_URL).reply(200, {
        contentCards: [
          {
            id: '001',
            imageUri: 'url-to-image',
            textData: {
              title: 'Post Title',
              subTitle: 'Post SubTitle',
              body: 'Post Body',
              author: {
                first: 'Jane',
                last: 'Doe',
              },
            },
            metadata: {
              priority: 1,
              publishDate: '2021-01-01T00:00:00.000Z',
            },
            comments: [
              {
                text: 'Great read!',
                author: 'Alice',
                profilePic: 'url-to-image',
                likes: 5,
              },
            ],
          },
        ],
      });
    });

    it('fetches and stores posts correctly', async () => {
      await fetchAndStorePosts();
      expect(mock.history.get.length).toBe(1);
      expect(postsQueue.enqueuePosts).toHaveBeenCalled();
    });

    it('gets a batch of posts correctly', async () => {
      const posts = await getBatchOfPosts();
      expect(posts).toHaveLength(10);
    });

    it('fetches more posts when the queue is too short', async () => {
      (postsQueue.countPostsInQueue as jest.Mock).mockResolvedValueOnce(5);
      await getBatchOfPosts();
      expect(mock.history.get.length).toBe(1);
      expect(postsQueue.enqueuePosts).toHaveBeenCalled();
    });
  });
});
