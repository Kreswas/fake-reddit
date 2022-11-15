import { useSession } from 'next-auth/react';
import React from 'react';

function PostBox() {
  return (
    <form>
      <div className="flex items-center space-x-3">
        <input
          className="mt-3 mx-20 flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
          // disabled={!session}
          type="text"
          // placeholder={session ? 'Create a Post' : 'Sign in to Post'}
          placeholder="Create a Post"
          onClick={() => (location.href = '/posts/admin')}
        />
      </div>
    </form>
  );
}

export default PostBox;
