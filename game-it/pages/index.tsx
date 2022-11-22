import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import type { GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
// import Avatar from '../components/Avatar';
import PostBox from '../components/PostBox';
import { getPostsWithJoint, PostDTO } from '../database/post';
import { getSubreddits, Subreddit } from '../database/subreddit';

type Props = {
  filteredPosts: PostDTO[];
  subredditList: Subreddit[];
};

export default function PostFromDataBase(props: Props) {
  // const [subredditFilter, setSubredditFilter] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState(props.filteredPosts);
  return (
    <div>
      <Head>
        <title>GameIt/Home</title>
        <meta name="description" content="Game It home page" />
      </Head>

      <PostBox />

      <div className="flex gap-4 my-4 px-8 ">
        <div className="w-52">
          <TopicSelector
            subreddits={props.subredditList}
            onChange={(id) =>
              setFilteredPosts(
                id === undefined
                  ? props.filteredPosts
                  : props.filteredPosts.filter(
                      (post) => post.subredditsId === id,
                    ),
              )
            }
          ></TopicSelector>
        </div>
        <div className="max-w-2xl flex-1 flex flex-col gap-4">
          {filteredPosts?.length ? (
            filteredPosts?.map((post, idx) => (
              <PostPreview key={idx} post={post} />
            ))
          ) : (
            <div className="p-4 text-center text-2xl flex flex-col">
              <strong>There are no posts yet.</strong>
              <br />
              Be the first one to post here!
            </div>
          )}
          <div className="flex flex-col items-center">
            <button
              onClick={() => (location.href = '/posts/submit')}
              className="bg-blue-500 rounded-full px-5"
            >
              Create a Post!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(): Promise<
  GetServerSidePropsResult<Props>
> {
  const postsList = await getPostsWithJoint();
  const subredditList = await getSubreddits();
  return {
    props: {
      filteredPosts: JSON.parse(JSON.stringify(postsList)),
      subredditList: subredditList,
    },
  };
}

export const TopicSelector = (props: {
  subreddits: Subreddit[];
  onChange: (id?: number) => unknown;
}) => {
  const [id, setId] = useState<number | undefined>(undefined);

  const items = (
    [[void 0, 'All topics']] as [number | undefined, string][]
  ).concat(props.subreddits.map(({ id, topic }) => [id, topic]));

  useEffect(() => {
    props.onChange(id);
  }, [id]);

  return (
    <>
      {items.map(([_id, label], idx) => (
        <TopicSelectorItem
          key={idx}
          active={_id === id}
          onClick={() => setId(_id)}
        >
          {label}
        </TopicSelectorItem>
      ))}
    </>
  );
};

export const TopicSelectorItem = (
  props: React.PropsWithChildren<{
    active: boolean;
    onClick: () => unknown;
  }>,
) => (
  <div
    className={
      'p-2 rounded cursor-pointer ' + (props.active ? 'sidebar' : 'surface')
    }
    onClick={props.onClick}
  >
    {props.children}
  </div>
);

export const PostPreview = (props: { post: PostDTO }) => (
  <div
    key={`posts-${props.post.id}`}
    className="drop-shadow-sm surface p-4 rounded"
  >
    <a href={`posts/${props.post.id}`}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-xs text-reversed py-1 px-2 rounded surface-2">
            {props.post.topic}
          </div>
          <div className="flex text-xs">
            Posted by:
            {
              <Image
                className="mt-0 ml-2 mr-1"
                width={15}
                height={15}
                alt=""
                src={`https://avatars.dicebear.com/api/identicon/${props.post.username}.svg`}
              />
            }{' '}
            u/{props.post.username}
          </div>
          <TimeAgo date={props.post.postDate} className="text-xs flex-end" />
        </div>
        <h3 className="text-lg">{props.post.title}</h3>
        <div className="place-self-center">
          <img className="w-full" src={props.post.image} alt="" />
        </div>
        <hr />
        <div className="mb-5">{props.post.body}</div>
      </div>
      <hr />
      <div className="mt-1 flex justify-center">
        <ChatBubbleLeftIcon className="comment-icon" />
      </div>
    </a>
  </div>
);
