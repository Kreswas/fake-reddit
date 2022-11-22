import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CommentDTO, getFoundCommentByPostId } from '../../database/comments';
import { getFoundPostById, PostDTO } from '../../database/post';
import { getUserBySessionToken } from '../../database/users';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

// import TimeAgo from 'react-timeago';

type UserHere = {
  id: number;
  username: string;
};

type Props = {
  foundPostsss?: PostDTO;
  user?: UserHere;
  databaseComments?: CommentDTO[];
  error?: string;
};

export default function SinglePost(props: Props) {
  const [allComments, setAllComments] = useState<CommentDTO[]>([]);
  const [newComment, setNewComment] = useState('');

  async function getCommentsFromApi() {
    if (props.databaseComments) {
      setAllComments(props.databaseComments);
    }
  }
  async function createCommentFromApi() {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.user?.id.toString(),
        postId: props.foundPostsss?.id,
        text: newComment,
      }),
    });

    const commentFromApi = (await response.json()) as CommentDTO;
    const newState = [
      ...allComments,
      { ...commentFromApi, username: props.user?.username },
    ];
    setAllComments(newState);
    console.log('state', newState);
    setNewComment('');
  }

  useEffect(() => {
    getCommentsFromApi().catch((err) => {
      console.log(err);
    });
  }, []);

  if ('error' in props) {
    return (
      <div>
        <Head>
          <title>Post not found</title>
          <meta name="description" content="post not found" />
        </Head>
        <h1>{props.error}</h1>
        sorry, try <Link href="/index.js">this</Link>
      </div>
    );
  }
  return (
    <div>
      <div
        key={`posts-${props.foundPostsss?.id}`}
        className="drop-shadow-sm surface p-4 rounded mt-5 mb-5 space-y-5 mx-auto max-w-2xl"
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="text-xs text-reversed py-1 px-2 rounded surface-2">
              {props.foundPostsss?.topic}
            </div>
            <div className="flex text-xs justify-end">
              Posted by:
              {
                <Image
                  className="mt-0 ml-2 mr-1"
                  width={15}
                  height={15}
                  alt=""
                  src={`https://avatars.dicebear.com/api/identicon/${props.foundPostsss?.username}.svg`}
                />
              }{' '}
              u/{props.foundPostsss?.username}
              {/* </div> */}
            </div>
            {/* <div className="text-xs flex flex-col "></div> */}
            {/* <TimeAgo
                date={props.foundPostsss?.postDate}
                className="text-xs flex-end"
              /> */}
          </div>
          <h3 className="text-lg">{props.foundPostsss?.title}</h3>
          {/* <hr /> */}
          <div className="place-self-center">
            <img className="w-full" src={props.foundPostsss?.image} alt="" />
          </div>
          <hr />
          <div className="mb-5">{props.foundPostsss?.body}</div>
        </div>
        <hr />
        {/* <div className="mt-1">
          <strong>
            <em>add the upvotes add the comment number with the icon???????</em>
          </strong>
        </div> */}
        <p>Leave a comment.</p>
        <div className="grid place-items-center">
          {props.user ? (
            <>
              <div>
                {' '}
                <textarea
                  className="comment-bg"
                  value={newComment}
                  placeholder=" Leave a comment "
                  rows={5}
                  cols={50}
                  onChange={(post) => {
                    setNewComment(post.currentTarget.value);
                  }}
                ></textarea>
                <div>
                  <button
                    // className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    onClick={async () => {
                      await createCommentFromApi();
                    }}
                  >
                    Comment
                  </button>
                </div>
              </div>
              <div className="">
                {allComments?.map((comment) => {
                  console.log('comments', allComments);
                  return (
                    <div key={`commentsList-${comment.id}`}>
                      <div>
                        <div className="flex text-xs ">
                          {/* <Person/> */}
                          u/:
                          {
                            <Image
                              className="mt-0 ml-2 mr-1"
                              width={15}
                              height={15}
                              alt=""
                              src={`https://avatars.dicebear.com/api/identicon/${props.foundPostsss?.username}.svg`}
                            />
                          }
                          {comment.username}
                        </div>
                        <hr className="bg-color:#fff border-t-2 border-dotted border-hr_color mt-1" />
                        <div> {comment.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div>
              <div> to leave a comment please first log in </div>
              <Link href="/login">Login</Link>
            </div>
          )}
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));
  const postId = parseIntFromContextQuery(context.query.postId);

  if (typeof postId === 'undefined') {
    context.res.statusCode = 404;
    return {
      props: {
        error: 'post not found',
      },
    };
  }

  const foundPost = await getFoundPostById(Number(postId));
  if (typeof foundPost === 'undefined') {
    return {
      props: {
        error: 'no posts found',
      },
    };
  }
  const databaseComments =
    postId && (await getFoundCommentByPostId(Number(postId)));
  // console.log(databaseComments);
  return {
    props: {
      databaseComments: databaseComments ? databaseComments : [],
      foundPostsss: JSON.parse(JSON.stringify(foundPost)),
      // foundPostsss: foundPost,
      user: user ? user : null,
    },
  };
}
