import { formatTimeAgo } from '@/utilities/format-date';
import Image from 'next/image';
import ReactShowMoreText from 'react-show-more-text';
import { PostCommentProps } from './post-comment';
import PostComments from './post-comments';

type PostProps = {
  title: string;
  subTitle: string;
  body: string;
  author: string;
  publishDate: Date;
  imageUri: string;
  comments: PostCommentProps[];
};

export default function Post(post: PostProps) {
  return (
    <article className="flex flex-col gap-8 rounded-lg shadow-lg">
      <Image
        src={post.imageUri}
        alt={post.title}
        className="aspect-[16/9] w-full rounded-t-lg bg-gray-50 object-cover"
        width={300}
        height={500}
      />
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between gap-x-4 text-xs">
          <time
            dateTime={post.publishDate.toUTCString()}
            className="text-gray-500"
          >
            {formatTimeAgo(post.publishDate)}
          </time>
          <p className="font-semibold text-gray-900">{post.author}</p>
        </div>
        <div className="">
          <h3 className="mt-3 text-xl font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            {post.title}
          </h3>
          <h4 className="mt-3 font-semibold leading-6 text-gray-700 group-hover:text-gray-600">
            {post.subTitle}
          </h4>
          <ReactShowMoreText
            lines={3}
            className="mt-5 text-balance text-sm leading-6 text-gray-600"
            anchorClass="text-blue-500 hover:underline cursor-pointer"
          >
            {post.body}
          </ReactShowMoreText>
        </div>
        <div className="mt-6 flex border-t border-gray-900/5 pt-4">
          <PostComments comments={post.comments} />
        </div>
      </div>
    </article>
  );
}
