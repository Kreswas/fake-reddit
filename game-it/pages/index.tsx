import type { GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import TimeAgo from 'react-timeago';
// import Avatar from '../components/Avatar';
import PostBox from '../components/PostBox';
import { getPostsWithJoint, PostDTO } from '../database/post';
import { getSubreddits, Subreddit } from '../database/subreddit';

type Props = {
  filteredPosts: PostDTO[];
  subredditList: Subreddit[];
};

// const Home: NextPage = () => {
//   return (
//     <div className="">
//       <Head>
//         <title>GameIt/Home</title>
//         <link rel="icon" href="/favicon.ico" />    Check  this part out later!!!!!
//       </Head>
//       <PostBox />
//     </div>
//   );
// };

export default function PostFromDataBase(props: Props) {
  const [subredditFilter, setSubredditFilter] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState(props.filteredPosts);
  return (
    <div>
      <Head>
        <title>GameIt/Home</title>
        <meta name="description" content="Game It home page" />
      </Head>

      <PostBox />

      <select
        className="mt-10 search-dark"
        value={subredditFilter}
        onChange={(e) => {
          setSubredditFilter(Number(e.currentTarget.value));
          if (Number(e.currentTarget.value) === 0) {
            setFilteredPosts(props.filteredPosts);
          }

          if (Number(e.currentTarget.value) !== 0) {
            const filteredPost = props.filteredPosts.filter((post) => {
              return post.subredditsId === Number(e.currentTarget.value);
            });
            setFilteredPosts(filteredPost);
          }
        }}
      >
        <option className="text-dark" value={0}>
          All categories
        </option>
        {props.subredditList?.map((subreddit) => {
          return (
            <option
              className="text"
              value={subreddit.id}
              key={`categoriesList-${subreddit.id}`}
            >
              {subreddit.topic}
            </option>
          );
        })}
      </select>
      {/* <h1>all posts</h1> */}
      {/* <p>To find out more click on your favorite post !</p> */}
      <div className="mt-5 mb-5 space-y-5 mx-auto max-w-2xl">
        {filteredPosts?.map((post) => {
          return (
            <div
              key={`posts-${post.id}`}
              className="drop-shadow-sm surface p-4 rounded"
            >
              <a href={`posts/${post.id}`}>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="text-xs text-reversed py-1 px-2 rounded surface-2">
                      {post.topic}
                    </div>
                    <div className="flex text-xs">
                      Posted by:
                      {
                        <Image
                          className="mt-0 ml-2 mr-1"
                          width={15}
                          height={15}
                          alt=""
                          src={`https://avatars.dicebear.com/api/identicon/${post.username}.svg`}
                        />
                      }{' '}
                      u/{post.username}
                      {/* </div> */}
                    </div>
                    <div className="text-xs flex flex-col "></div>
                    <TimeAgo
                      date={post.postDate}
                      className="text-xs flex-end"
                    />
                  </div>
                  <h3 className="text-lg">{post.title}</h3>
                  {/* <hr /> */}
                  <div className="place-self-center">
                    {/* <Image
                      src={post.image}
                      width={250}
                      height={190}
                      alt="preview"
                    /> */}
                    <img className="w-full" src={post.image} alt="" />
                  </div>
                  <hr />
                  <div className="mb-5">{post.body}</div>
                </div>
                <hr />
                <div className="mt-1">
                  <strong>
                    <em>
                      add the upvotes add the comment number with the
                      icon???????
                    </em>
                  </strong>
                </div>
              </a>
            </div>
          );
        })}
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

// export default Home;
