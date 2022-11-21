import Head from 'next/head';
// import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
  return (
    <>
      <Head>
        <title>GamIt</title>
        <meta
          name="Platform for games for Gamers!"
          content="Social platform where you can Share/Talk about games"
        />
        <link rel="icon" href="favicon-16.jpeg" />
      </Head>
      <Header user={props.user} />
      <main>{props.children}</main>
      {/* <Footer /> */}
    </>
  );
}
