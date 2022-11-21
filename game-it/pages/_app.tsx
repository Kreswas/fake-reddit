// import '../styles/globals.css';
// import { SessionProvider } from 'next-auth/react';
// import type { AppProps } from 'next/app';
// import Header from '../components/Header';

// function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
//   return (
//     <SessionProvider session={session}>
//       <div className="h-screen overflow-y-scroll bg-slate-200">
//         <Header />
//         <Component {...pageProps} />
//       </div>
//     </SessionProvider>
//   );
// }

// export default MyApp;

import '../styles/globals.css';
// import { css, Global } from '@emotion/react';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [user, setUser] = useState();

  const refreshUserProfile = useCallback(async () => {
    const profileResponse = await fetch('/api/profile');
    const profileResponseBody = await profileResponse.json();

    if ('errors' in profileResponseBody) {
      setUser(undefined);
    } else {
      setUser(profileResponseBody.user);
    }
  }, []);

  useEffect(() => {
    refreshUserProfile().catch(() => console.log('fetch api failed'));
  }, [refreshUserProfile]);

  return (
    // <div className="bg-slate-200">
    <div>
      <SessionProvider session={session}>
        <Layout user={user}>
          <div>
            {/* <Header /> */}
            <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
          </div>
        </Layout>
      </SessionProvider>
      {/* <Global
        styles={css`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }
          body {
            margin: 0;
          }
        `}
      /> */}
      {/* <Layout user={user}>
        <Component {...pageProps} refreshUserProfile={refreshUserProfile} />
      </Layout> */}
    </div>
  );
}

export default MyApp;
