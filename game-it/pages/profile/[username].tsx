// import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getUserByUsername, User } from '../../database/users';

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
        <title>Profile</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <div>
        <h1>idk for now</h1>

        <div>
          <p>username: {props.user.username}</p>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Retrieve the username from the URL
  const username = context.query.username as string;

  const user = await getUserByUsername(username.toLowerCase());

  if (!user) {
    context.res.statusCode = 404;
    return { props: {} };
  }

  return {
    props: { user },
  };
}
