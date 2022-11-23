import {
  Bars3Icon,
  ChevronDownIcon,
  HomeIcon,
} from '@heroicons/react/20/solid';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PlusIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

function Anchor({ children, ...restProps }) {
  // console.log(typeof children);
  // console.log(children);
  // using a instead of Link since we want to force a full refresh
  return <a {...restProps}>{children}</a>;
}

function Header(props) {
  const { data: session } = useSession();

  useEffect(() => {
    if (localStorage.getItem('dark-mode') === 'true') {
      toggleDarkMode();
    }
  }, []);

  function toggleDarkMode() {
    const darkMode = document.body.classList.toggle('dark');
    localStorage.setItem('dark-mode', darkMode.toString());
    console.log(darkMode);
  }

  return (
    <div className="sticky top-0 z-50 flex surface px-4 py-2 shadow-sm gap-2">
      <div className="relative h-10 w-20 mt-1 flex-shrink-0 cursor-pointer">
        <Link href="/">
          <Image
            objectFit="contain"
            alt="Header Image"
            src="/video-games-joystick-svgrepo-com.png"
            // className="bg-white bg-contain rounded-full"
            // src="https://www.redditinc.com/assets/images/blog/_720xAUTO_crop_center-center_none/f4232-snoo-games.png"
            layout="fill"
          />
        </Link>
      </div>
      <Link href="/" className="mx-7 flex items-center">
        <HomeIcon className="h-5 w-5" />
        <p className=" ml-2 hidden lg:inline cursor-default">Home</p>
        <ChevronDownIcon className="h-5 w-24 cursor-pointer" />
      </Link>
      {/* Search box */}
      <form className="flex flex-1 items-center space-x-2 rounded-full border border-gray-200 post px-3 py-1 mr-20 ml-20">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search Game It"
        />
        <button type="submit" hidden />
      </form>
      <div className=" text-gray-500 space-x-4 mx-5 items-center hidden lg:inline-flex">
        <ChatBubbleLeftRightIcon className="icon hover:bg-gray-300" />
        <MoonIcon
          className="icon hover:bg-gray-300"
          onClick={() => toggleDarkMode()}
        />
        <PlusIcon
          className="icon hover:bg-gray-300"
          onClick={() => (location.href = '/posts/submit')}
        />
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <Bars3Icon className="icon hover:bg-gray-300" />
      </div>

      {/* Sign in / SignOut button */}
      {/* {session ? (
        <div
          onClick={() => signOut()}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex hover:bg-gray-100"
        >
          <div className="relative h-5 w-5 flex-shrink-0  ">
            <UserCircleIcon />
          </div>

          <div className="flex-1 text-m">
            <p>{session.user?.name}</p>
            <p className="text-gray-400 text-xs">Sign Out</p>
          </div>
          <ChevronDownIcon className="h-5 flex-shrink-0 text-gray-400" />
        </div>
      ) : ( */}
      {/* <div>{props.user && props.user.username}</div> */}
      {props.user ? (
        <>
          <UserCircleIcon
            className="icon mt-1 mr-3 m-0 m-auto text-gray-500 hover:bg-gray-300"
            onClick={() => (location.href = `/profile/${props.user.username}`)}
          />
          <Anchor
            className="hidden cursor-pointer items-center space-x-2 border border-gray-400 p-2 lg:flex hover:bg-gray-800 rounded-full"
            href="/logout"
          >
            Log Out
          </Anchor>
        </>
      ) : (
        <>
          <div
            onClick={() => (location.href = '/register')}
            className="hidden cursor-pointer items-center space-x-2 border border-gray-400 p-2 lg:flex hover:bg-gray-100 rounded-full px-4 mr-4"
          >
            <p className="text-blue-500">
              <strong>Sign Up</strong>
            </p>
          </div>

          <div
            onClick={() => (location.href = '/login')}
            // onClick={() => signIn()}
            className="login-text hidden cursor-pointer items-center space-x-2 border border-gray-400 p-2 lg:flex hover:bg-blue-400 rounded-full px-5 bg-blue-500 "
          >
            {/* <div className="relative h-5 w-5 flex-shrink-0  ">
              <UserCircleIcon />
            </div> */}
            <p>
              <strong>Log In</strong>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
