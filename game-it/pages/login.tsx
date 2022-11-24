import { GetServerSidePropsContext } from 'next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { LoginResponseBody } from './api/login';

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Login(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();

  async function loginHandler() {
    const loginResponse = await fetch('/api/login', {
      // we use post bc we are creating a new session
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
      }),
    });

    const loginResponseBody = (await loginResponse.json()) as LoginResponseBody;

    if ('errors' in loginResponseBody) {
      setErrors(loginResponseBody.errors);
      return console.log(loginResponseBody.errors);
    }

    console.log(router.query.returnTo);

    const returnTo = router.query.returnTo;

    if (
      returnTo &&
      !Array.isArray(returnTo) && // Security: Validate returnTo parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      // refresh the user on state
      await props.refreshUserProfile();
      return await router.push(returnTo);
    }

    // refresh the user on state
    await props.refreshUserProfile();
    // redirect user to user profile
    await router.push(`/profile/${username}`);
  }

  return (
    <div>
      <div>
        <Head>
          <title>Login</title>
          <meta name="description" content="login page of the app" />
        </Head>

        <div className="flex flex-col space-y-8 mt-8">
          <h3 className="font-bold text-2xl text-center"> Your Account </h3>
          {errors.map((error) => {
            return <p key={error.message}>ERROR: {error.message}</p>;
          })}
          <div className="flex items-center justify-center ">
            <div className="bg-form flex flex-col w-1/3 border border-gray-900 rounded-lg px-8 py-5">
              <div className="flex flex-col space-y-5 mt-5 ">
                <label className="font-bold text-lg text-white ">
                  User Name
                </label>
                <input
                  className="text-white border rounded-lg py-3 px-3 mt-4 bg-black border-indigo-600 placeholder-white-500"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.currentTarget.value.toLowerCase());
                  }}
                  placeholder="Username"
                />
                <label className="font-bold text-lg text-white">Password</label>
                <input
                  className="border rounded-md py-3 px-3 bg-black border-indigo-600 placeholder-white-500 text-white"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                  placeholder="Password"
                />
                <br />
                <button
                  className="border border-indigo-600 bg-black text-white rounded-lg py-3 mx-28 font-semibold hover:bg-gray-900"
                  onClick={async () => {
                    await loginHandler();
                  }}
                >
                  Log In
                </button>
                <div className="text-center">
                  <p> Don't have any account ?</p>
                  <Link
                    href="/register"
                    type="button"
                    className="bg-indigo-800 hover:bg-indigo-400 rounded-full p-2 mt-2"
                  >
                    Create Account
                  </Link>
                </div>
                <div className="text-center flex flex-col">
                  <p>or log in with</p>
                  <button
                    className="cursor-pointer self-center space-x-2 border border-orange-900 bg-orange-600 p-2 lg:flex hover:bg-orange-00 rounded-xl mt-2"
                    onClick={() => signIn()}
                  >
                    Reddit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  if (token && (await getValidSessionByToken(token))) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
