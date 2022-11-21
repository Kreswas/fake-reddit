import { GetServerSidePropsContext } from 'next';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getValidSessionByToken } from '../database/sessions';
import { LoginResponseBody } from './api/login';

// const buttonStyles = css`
//   text-decoration: none;
//   padding: 5px 10px;
//   font-size: 20px;
//   width: 220px;
//   height: 50px;
//   border: none;
//   outline: none;
//   color: #fff;
//   background: #111;
//   cursor: pointer;
//   position: relative;
//   z-index: 0;
//   border-radius: 10px;
//   :before {
//     content: '';
//     background: linear-gradient(
//       45deg,
//       #ff0000,
//       #ff7300,
//       #fffb00,
//       #48ff00,
//       #00ffd5,
//       #002bff,
//       #7a00ff,
//       #ff00c8,
//       #ff0000
//     );
//     position: absolute;
//     top: -2px;
//     left: -2px;
//     background-size: 400%;
//     z-index: -1;
//     filter: blur(5px);
//     width: calc(100% + 4px);
//     height: calc(100% + 4px);
//     animation: glowing 20s linear infinite;
//     opacity: 0;
//     transition: opacity 0.3s ease-in-out;
//     border-radius: 10px;
//   }
//   :active {
//     color: #000;
//   }
//   :active:after {
//     background: transparent;
//   }
//   :hover:before {
//     opacity: 1;
//   }
//   :after {
//     z-index: -1;
//     content: '';
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     background: #111;
//     left: 0;
//     top: 0;
//     border-radius: 10px;
//   }
//   @keyframes glowing {
//     0% {
//       background-position: 0 0;
//     }
//     50% {
//       background-position: 400% 0;
//     }
//     100% {
//       background-position: 0 0;
//     }
//   }
// `;

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
    await router.push(`/private-profile`);
  }

  return (
    <div>
      <div>
        <Head>
          <title>Login</title>
          <meta name="description" content="login page of the app" />
        </Head>

        <div>
          <h3> Your Account </h3>
          {errors.map((error) => {
            return <p key={error.message}>ERROR: {error.message}</p>;
          })}
          <input
            className="text-black"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value.toLowerCase());
            }}
            placeholder="Username"
          />
          <input
            className="text-black"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
            placeholder="Password"
          />
          <br />
          <div>
            <button
              // css={buttonStyles}
              onClick={async () => {
                await loginHandler();
              }}
            >
              Log In
            </button>
            <p> Don't have any account ?</p>
            <Link href="/register">Create Account</Link>
          </div>
          <div>
            <p>or log in with</p>
            <button
              className="cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex hover:bg-gray-100"
              onClick={() => signIn()}
            >
              Reddit
            </button>
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
