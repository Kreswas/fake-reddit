// import { GetServerSidePropsResult } from 'next';
// import Head from 'next/head';
// import Image from 'next/image';
// import { useState } from 'react';
// import { getPostsWithJoint, PostDTO } from '../../database/post';
// import { getSubreddits, Subreddit } from '../../database/subreddit';

// type Props = {
//   filteredPosts: PostDTO[];
//   subredditList: Subreddit[];
// };
// export default function PostFromDataBase(props: Props) {
//   const [subredditsFilter, setsubredditsFilter] = useState(0);
//   const [filteredPosts, setFilteredPosts] = useState(props.filteredPosts);
//   return (
//     <div>
//       <Head>
//         <title>list of posts</title>
//         <meta name="description" content="List of posts in qvent app" />
//       </Head>

//       <select
//         value={subredditsFilter}
//         onChange={(e) => {
//           setsubredditsFilter(Number(e.currentTarget.value));
//           if (Number(e.currentTarget.value) === 0) {
//             setFilteredPosts(props.filteredPosts);
//           }

//           if (Number(e.currentTarget.value) !== 0) {
//             const filteredPost = props.filteredPosts.filter((post) => {
//               return post.subredditsId === Number(e.currentTarget.value);
//             });
//             setFilteredPosts(filteredPost);
//           }
//         }}
//       >
//         <option value={0}>All subreddits</option>
//         {props.subredditList?.map((subreddits) => {
//           return (
//             <option
//               value={subreddits.id}
//               key={`subredditsList-${subreddits.id}`}
//             >
//               {subreddits.topic}
//             </option>
//           );
//         })}
//       </select>

//       <h1>all posts</h1>
//       <p>To find out more click on your favorite post !</p>
//       <div>
//         {filteredPosts?.map((post) => {
//           return (
//             <div key={`posts-${post.id}`}>
//               <a href={`posts/${post.id}`}>
//                 <div>
//                   <h3>Post: {post.title}</h3>
//                   <div>Host: {post.username}</div>
//                   <div>{post.topic}</div>
//                 </div>
//               </a>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export async function getServerSideProps(): Promise<
//   GetServerSidePropsResult<Props>
// > {
//   const postsList = await getPostsWithJoint();
//   const subredditList = await getSubreddits();
//   return {
//     props: {
//       filteredPosts: JSON.parse(JSON.stringify(postsList)),
//       subredditList: subredditList,
//     },
//   };
// }

import { GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { getPostsWithJoint, PostDTO } from '../../database/post';
import { getSubreddits, Subreddit } from '../../database/subreddit';

type Props = {
  filteredPosts: PostDTO[];
  subredditList: Subreddit[];
};
export default function PostFromDataBase(props: Props) {
  const [subredditFilter, setSubredditFilter] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState(props.filteredPosts);
  return (
    <div>
      <Head>
        <title>list of posts</title>
        <meta name="description" content="List of posts in qvent app" />
      </Head>

      <select
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
        <option value={0}>All categories</option>
        {props.subredditList?.map((subreddit) => {
          return (
            <option value={subreddit.id} key={`categoriesList-${subreddit.id}`}>
              {subreddit.topic}
            </option>
          );
        })}
      </select>
      <div>
        {' '}
        <h1>All Posts</h1>
        <p>To find out more click on your favorite post !</p>
      </div>

      <div>
        {filteredPosts?.map((post) => {
          return (
            <div key={`posts-${post.id}`}>
              <a href={`posts/${post.id}`}>
                <Image
                  src={post.image}
                  width={250}
                  height={190}
                  alt="preview"
                />

                <div>
                  <h3>Post: {post.topic}</h3>
                  <div>Host: {post.username}</div>
                  <div>{post.topic}</div>
                  {/* <Search /> */}
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
