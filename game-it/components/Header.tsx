import {
  Bars3Icon,
  ChevronDownIcon,
  HomeIcon,
  SignalIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid';
import {
  BellIcon,
  ChatBubbleLeftIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React from 'react';

function Header() {
  const { data: session } = useSession();
  return (
    <div className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm">
      <div className="relative h-10 w-20 mt-1 flex-shrink-0 cursor-pointer">
        <Image
          objectFit="contain"
          alt="Header Image"
          src="https://www.redditinc.com/assets/images/blog/_720xAUTO_crop_center-center_none/f4232-snoo-games.png"
          layout="fill"
        />
      </div>
      <div className="mx-7 flex items-center xl:min-w-[300px]">
        <HomeIcon className="h-5 w-5" />
        <p className="flex-1 ml-2 hidden lg:inline">Home</p>
        <ChevronDownIcon className="h-5 w-5" />
      </div>
      {/* Search box */}
      <form className="flex flex-1 items-center space-x-2 rounded-sm border border-gray-200 bg-gray-100 px-3 py-1">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
        <input
          className="flex-1 bg-transparent outline-none"
          type="text"
          placeholder="Search Game It"
        />
        <button type="submit" hidden />
      </form>
      <div className=" text-gray-500 space-x-2 mx-5 items-center hidden lg:inline-flex">
        <SparklesIcon className="icon" />
        <GlobeAltIcon className="icon" />
        <VideoCameraIcon className="icon" />
        <hr className="h-10 border border-gray-100" />
        <ChatBubbleLeftIcon className="icon" />
        <BellIcon className="icon" />
        <PlusIcon className="icon" />
      </div>
      <div className="ml-5 flex items-center lg:hidden">
        <Bars3Icon className="icon" />
      </div>
      {/* Sign in / SignOut button */}
      {session ? (
        <div
          // onClick={() => "location.href='/login'"}
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
      ) : (
        <div
          // onClick={() => (location.href = '/login')}
          onClick={() => signIn()}
          className="hidden cursor-pointer items-center space-x-2 border border-gray-100 p-2 lg:flex hover:bg-gray-100"
        >
          <div className="relative h-5 w-5 flex-shrink-0  ">
            <UserCircleIcon />
          </div>
          <p className="text-gray-400">Sign In</p>
        </div>
      )}
    </div>
  );
}

export default Header;
