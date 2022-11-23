import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import TimeAgo from 'react-timeago';
import {
  getPostByLoggedInUser,
  getPostsWithJoint,
  Post,
} from '../database/post';
import { getUserBySessionToken, User } from '../database/users';

type Props = {
  postss: Post[];
  user?: User;
};

export default function UserProfile(props: Props) {
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
        Better luck next time
      </>
    );
  }

  const name = props.user.username;
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
  // console.log('name', nameCapitalized);
  return (
    <>
      <Head>
        <title>Your Post History | GameIt</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <div>
        <div>
          <br />
          <br />
          <strong>
            <h1 className="text-center text-3xl">Hello, {nameCapitalized}!</h1>
          </strong>

          <div>
            {/* <h1>Hello! {props.user.username}</h1> */}
            {/* <p>Home Page</p> */}
            <button className="ml-10 bg-gray-900 p-2 rounded-full hover:bg-gray-600">
              <Link href="/">Back to the Home Page</Link>
            </button>
          </div>
          <br />
          <br />
          <br />
        </div>
      </div>
      <div>
        <h2 className="text-center text-2xl">Post History</h2>
        <hr className=" border-dotted border-t-8 mt-2 mx-56" />
      </div>
      <div className="mt-5 mb-5 space-y-5 mx-auto max-w-2xl">
        {props.postss?.map((post) => {
          return (
            <div
              key={`postId-${post.id}`}
              className="drop-shadow-sm surface p-4 rounded"
            >
              <a href={`posts/${post.id}`}>
                <div className="flex flex-col gap-4">
                  {/* <div className="flex justify-between"> */}
                  <TimeAgo date={post.postDate} className="text-xs flex-end" />
                  <div className="text-lg">Title: {post.title}</div>
                  <hr />
                  <div className="mb-5">{post.body}</div>
                </div>
              </a>
            </div>
            // </div>
          );
        })}
      </div>
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/private-profile',
        permanent: false,
      },
    };
  }
  const postsByInUser = user && (await getPostByLoggedInUser(user.id));
  const postsList = await getPostsWithJoint();
  return {
    // postss: JSON.parse(JSON.stringify(postsByInUser)),
    props: {
      user,
      postss: JSON.parse(JSON.stringify(postsByInUser)),
    },
  };
}
