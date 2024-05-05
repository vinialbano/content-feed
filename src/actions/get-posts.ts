'use server';
import { PostType, getBatchOfPosts } from '@/utilities/data-fetcher';

export const getPosts = async (): Promise<PostType[]> => {
  try {
    return await getBatchOfPosts();
  } catch (e) {
    console.error('Error fetching posts', e);
    throw new Error(`An error happened: ${e}`);
  }
};
