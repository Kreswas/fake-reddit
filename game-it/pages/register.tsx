import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { RegisterResponseBody } from './api/register';

type Props = {
  refreshUserProfile: () => Promise<void>;
};

export default function Register(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const router = useRouter();
  // const [email, setEmail] = useState('');
  async function registerHandler() {
    const registerResponse = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLowerCase(),
        password,
      }),
    });

    const registerResponseBody =
      (await registerResponse.json()) as RegisterResponseBody;

    if ('errors' in registerResponseBody) {
      setErrors(registerResponseBody.errors);
      return console.log(registerResponseBody.errors);
    }

    const returnTo = router.query.returnTo;
    if (
      returnTo &&
      !Array.isArray(returnTo) && // Security: Validate return To parameter against valid path
      // (because this is untrusted user input)
      /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
    ) {
      return await router.push(returnTo);
    }
    // refresh the user on state
    await props.refreshUserProfile();
    // redirect user to the home page
    // await router.push(`/private-profile`);
    await router.push(`/`);
  }
  return (
    <div>
      <div>
        <Head>
          <title>Sign Up | GameIt</title>
          <meta name="description" content="login page of the app" />
        </Head>

        <div className="flex flex-col space-y-8 mt-8">
          <h3 className="font-bold text-2xl text-center">
            Create Your Account
          </h3>
          {errors.map((error) => {
            return <p key={error.message}>ERROR: {error.message}</p>;
          })}
          <div className="flex items-center justify-center ">
            {/** change the color here */}
            <div className="bg-form flex flex-col w-1/3 border border-gray-900 rounded-lg px-8 py-5">
              {/** change the color here */}
              <div className="flex flex-col space-y-5 mt-5">
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
                <label className="font-bold tex-lg text-white">Password</label>
                <input
                  className="border rounded-lg py-3 px-3 bg-black border-indigo-600 placeholder-white-500 text-white"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.currentTarget.value);
                  }}
                  placeholder="Password"
                />
                <br />
                <button
                  className="border border-indigo-600 bg-black text-white rounded-lg py-3 font-semibold"
                  onClick={async () => {
                    await registerHandler();
                  }}
                >
                  Sign Up
                </button>
                <div>
                  <p>Already a user ?</p>
                  <Link href="/login">Login</Link>
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
