import { getPosts } from '@/actions/get-posts';
import Navbar from '@/components/navbar';
import PostFeed from '@/components/post-feed';

export default async function Home() {
  const initialPosts = await getPosts();

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-between bg-gray-50 py-12 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Hot Takes
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Check out the latest posts from our community.
            </p>
            <PostFeed initialPosts={initialPosts} />
          </div>
        </div>
      </main>
    </>
  );
}
