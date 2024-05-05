import { HandThumbUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export type PostCommentProps = {
  author: string;
  body: string;
  profilePic: string;
  likes: number;
};

export default function PostComment({
  author,
  body,
  profilePic,
  likes,
}: PostCommentProps) {
  return (
    <>
      <div className="flex w-full flex-col bg-gray-50 p-4">
        <div className="flex items-center">
          <Image
            src={profilePic}
            alt={`${author}`}
            className="h-6 w-6 rounded-full"
            width={24}
            height={24}
          />
          <span className="ml-4 text-sm font-medium text-gray-900">
            {author}
          </span>
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600">{body}</p>
          <p className="mt-2 text-xs text-gray-600">
            <HandThumbUpIcon className="inline size-4 text-gray-600" /> {likes}{' '}
            <span className="sr-only">likes</span>
          </p>
        </div>
      </div>
    </>
  );
}
