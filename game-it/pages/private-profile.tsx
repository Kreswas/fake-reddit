import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getUserBySessionToken, User } from '../database/users';

type Props = {
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
          {/* <Link href="/pages/private-profile">Home</Link> */}
          <br />
          {/* <Link href="/pages/private-profile">profile</Link> */}
          <br />
          {/* <Link href="/events/admin">Events</Link> */}
        </div>
        <div>
          <h1>welcome back, {props.user.username}!</h1>
          {/* <p>Home Page</p> */}
          <button>
            <Link href="/">Home Page</Link>
          </button>
        </div>
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

  return {
    props: { user },
  };
}
