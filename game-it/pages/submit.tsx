import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { getUserBySessionToken } from '../database/users';

// type Props = {
//   user?: User;
// };

export default function UserProfile() {
  return (
    <>
      <Head>
        <title>Your Profile | GameIt</title>
        <meta name="description" content="Submit New Post Page" />
      </Head>
      <div>gonna make a page here to post</div> {/* or maybe not */}
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/submit',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}
