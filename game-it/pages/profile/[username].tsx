// import { css } from '@emotion/react';
// import { GetServerSidePropsContext } from 'next';
// import Head from 'next/head';
// import { getUserByUsername, User } from '../../database/users';

// type Props = {
//   user?: User;
// };

// export default function UserProfile(props: Props) {
//   if (!props.user) {
//     return (
//       <>
//         <Head>
//           <title>User not found</title>
//           <meta name="description" content="User not found" />
//         </Head>
//         <h1>404 - User not found</h1>
//         Better luck next time
//       </>
//     );
//   }

//   return (
//     <>
//       <Head>
//         <title>Profile</title>
//         <meta name="description" content="Biography of the person" />
//       </Head>
//       <div>
//         <h1>idk for now</h1>

//         <div>
//           <p>username: {props.user.username}</p>
//         </div>
//       </div>

//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//     </>
//   );
// }

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   // Retrieve the username from the URL
//   const username = context.query.username as string;

//   const user = await getUserByUsername(username.toLowerCase());

//   if (!user) {
//     context.res.statusCode = 404;
//     return { props: {} };
//   }

//   return {
//     props: { user },
//   };
// }

import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
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
  const name = props.user.username;
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <>
      <Head>
        <title>Host's Profile</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <div className="w-500pxm-0 m-auto flex flex-col items-center text-center surface border rounded-lg space-y-5 mt-5 mx-auto max-w-lg">
        {/**container  */}
        <h1 className="bg-clip-text text-transparent text-3xl p-10 bg-gradient-to-r from-blue-500 to-orange-200">
          Welcome, {nameCapitalized}
        </h1>
        <div>
          <img
            src={`https://avatars.dicebear.com/api/identicon/${props.user.username}.svg`}
            alt="avatar image of user"
            className="rounded-lg"
            width="200px"
            height="200px"
          />
          <p className=" text-2xl mt-10 mb-5">User: &nbsp;{nameCapitalized}</p>
        </div>
        <div className="grid grid-rows-4 grid-flow-col gap-4">
          <button
            className="border-2 border-blue-600 rounded-full px-3 py-2 text-blue-400 cursor-pointer hover:bg-blue-600 hover:text-white duration-500 "
            onClick={() => {
              location.href = '/';
            }}
          >
            Home Page
          </button>
          <button
            className="border-2 border-orange-600 text-orange-600 rounded-full px-3 py-2 text-blue-400 cursor-pointer hover:bg-orange-600 hover:text-white duration-500 "
            onClick={() => {
              location.href = '/posts/submit';
            }}
          >
            Create a new post
          </button>
          <button
            className="border-2 border-purple-600 text-purple-600 rounded-full px-3 py-2 text-blue-400 cursor-pointer hover:bg-purple-600 hover:text-white duration-500 "
            onClick={() => {
              location.href = '/private-profile';
            }}
          >
            Post History
          </button>
        </div>
      </div>
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
