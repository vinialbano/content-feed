'use client';
import { PostCommentType } from '@/utilities/data-fetcher';
import { useState } from 'react';
import PostComment from './post-comment';

export default function PostComments({
  comments,
}: {
  comments: PostCommentType[];
}) {
  const [showComments, setShowComments] = useState(false);
  return (
    <>
      {showComments ? (
        <div className="flex w-full flex-col gap-y-2">
          {comments.map((comment) => (
            <PostComment key={comment.author} {...comment} />
          ))}
        </div>
      ) : (
        <button
          className="w-full p-4 text-center text-sm text-blue-500 hover:bg-gray-50"
          onClick={() => setShowComments(true)}
        >
          Show comments
        </button>
      )}
    </>
  );
}
