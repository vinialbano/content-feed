import * as dataFetcher from '../utilities/data-fetcher';
import { getPosts } from './get-posts';

jest.mock('../utilities/data-fetcher');

describe('getPosts', () => {
  const mockPosts = [
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

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return posts when getBatchOfPosts is successful', async () => {
    (dataFetcher.getBatchOfPosts as jest.Mock).mockResolvedValue(mockPosts);
    const posts = await getPosts();
    expect(posts).toEqual(mockPosts);
  });

  it('should log and throw an error when getBatchOfPosts fails', async () => {
    const error = new Error('Failed to fetch posts');
    (dataFetcher.getBatchOfPosts as jest.Mock).mockRejectedValue(error);
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    await expect(getPosts).rejects.toThrow(`An error happened: ${error}`);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching posts', error);
    consoleSpy.mockRestore();
  });
});
