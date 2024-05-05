'use client';
import { getPosts } from '@/actions/get-posts';
import { PostType } from '@/utilities/data-fetcher';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Post from './post';

type PostFeedProps = {
  initialPosts: PostType[];
};

export default function PostFeed({ initialPosts }: PostFeedProps) {
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const { ref, inView } = useInView();

  const fetchMorePosts = async () => {
    const newPosts = await getPosts();
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
  };

  useEffect(() => {
    if (inView) {
      fetchMorePosts();
    }
  }, [inView]);

  return (
    <section className="mt-16 w-full grid-cols-3 space-y-10 lg:mt-20 lg:space-y-20">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
      <div ref={ref}>Loading...</div>
    </section>
  );
}
