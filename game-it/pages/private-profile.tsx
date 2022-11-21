import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getPostByLoggedInUser, Post } from '../database/post';
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
        <title>Your Profile | GameIt</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <div>
        <div>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
        <div>
          {/* <h1>Hello! {props.user.username}</h1> */}
          <h1>Hello! {nameCapitalized}</h1>
          {/* <p>Home Page</p> */}
          <button>
            <Link href="/">Home Page</Link>
          </button>
        </div>
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
  return {
    // postss: JSON.parse(JSON.stringify(postsByInUser)),
    props: { user, postss: JSON.parse(JSON.stringify(postsByInUser)) },
  };
}
