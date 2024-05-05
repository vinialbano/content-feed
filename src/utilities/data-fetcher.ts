import axios from 'axios';
import { countPostsInQueue, dequeuePosts, enqueuePosts } from './posts-queue';

const NUMBER_OF_POSTS_IN_BATCH = process.env.NUMBER_OF_POSTS_IN_BATCH
  ? parseInt(process.env.NUMBER_OF_POSTS_IN_BATCH)
  : 10;

export type APIPostCommentType = {
  text: string;
  author: string;
  profilePic: string;
  likes: number;
};

export type APIPostType = {
  id: string;
  imageUri: string;
  textData: {
    title: string;
    subTitle: string;
    body: string;
    author: {
      first: string;
      last: string;
    };
  };
  metadata: {
    priority: number;
    publishDate: string;
  };
  comments: APIPostCommentType[];
};

export type APIContentType = {
  contentCards: APIPostType[];
};

export type PostCommentType = {
  body: string;
  author: string;
  profilePic: string;
  likes: number;
};

export type PostType = {
  id: string;
  imageUri: string;
  title: string;
  subTitle: string;
  body: string;
  author: string;
  priority: number;
  publishDate: Date;
  comments: PostCommentType[];
};

export const parseCommentData = (
  comment: APIPostCommentType,
): PostCommentType => ({
  body: comment.text,
  author: comment.author,
  profilePic: comment.profilePic,
  likes: comment.likes,
});

export const parsePostData = (data: APIPostType): PostType => ({
  id: data.id,
  imageUri: data.imageUri,
  title: data.textData.title,
  subTitle: data.textData.subTitle,
  body: data.textData.body,
  author: `${data.textData.author.first} ${data.textData.author.last}`,
  priority: data.metadata.priority,
  publishDate: new Date(data.metadata.publishDate),
  comments: data.comments.map((comment) => parseCommentData(comment)),
});

export const parseAndSortPosts = (data: APIContentType): PostType[] => {
  return data.contentCards
    .map((item) => parsePostData(item))
    .sort((a, b) => b.priority - a.priority);
};

export const fetchAndStorePosts = async () => {
  const { data } = await axios.get(process.env.CONTENT_API_URL as string, {
    headers: {
      Prefer: 'code=200, dynamic=true',
    },
  });
  const posts = parseAndSortPosts(data);
  await enqueuePosts(posts);
};

export const getBatchOfPosts = async (): Promise<PostType[]> => {
  const postsInQueue = await countPostsInQueue();
  if (postsInQueue < NUMBER_OF_POSTS_IN_BATCH) {
    await fetchAndStorePosts();
  }
  return await dequeuePosts(NUMBER_OF_POSTS_IN_BATCH);
};
