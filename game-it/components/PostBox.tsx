import { useSession } from 'next-auth/react';
import React from 'react';

function PostBox() {
  return (
    <form>
      <div className="flex items-center space-x-3">
        <input
          className="mt-3 mr-72 ml-64  flex-1 rounded-md post p-2 pl-5 outline-none"
          // disabled={!session}
          type="text"
          // placeholder={session ? 'Create a Post' : 'Sign in to Post'}
          placeholder="Create a Post"
          onClick={() => (location.href = '/posts/submit')}
        />
      </div>
    </form>
  );
}

export default PostBox;

// mt-5 space-y-5 mx-auto max-w-2xl
