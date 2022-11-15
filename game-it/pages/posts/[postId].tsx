import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CommentDTO, getFoundCommentByPostId } from '../../database/comments';
import { getFoundPostById, PostDTO } from '../../database/post';
import { getUserBySessionToken } from '../../database/users';
import { parseIntFromContextQuery } from '../../utils/contextQuery';

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
    const newState = [...allComments, commentFromApi];
    setAllComments(newState);
    console.log(newState);
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
        sorry , try <Link href="/index.js">this</Link>
      </div>
    );
  }
  return (
    <div>
      <div>
        <div>
          <Image
            src={
              props.foundPostsss ? props.foundPostsss.image : 'uploaded image'
            }
            width={350}
            height={350}
            alt="preview"
          />
        </div>

        <div>
          <div>
            <div>Host:{props.foundPostsss?.username}</div>
            <div>Post Name: {props.foundPostsss?.title}</div>
            <div> Category: {props.foundPostsss?.topic}</div>
          </div>
        </div>
      </div>
      <p>Ask your questions here !</p>
      <div>
        {props.user ? (
          <>
            <div>
              {' '}
              <textarea
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
                  onClick={async () => {
                    await createCommentFromApi();
                  }}
                >
                  {/* <Send/> */}
                </button>
              </div>
            </div>
            <div>
              {allComments?.map((comment) => {
                return (
                  <div key={`commentsList-${comment.id}`}>
                    <div>
                      <div>
                        {/* <Person/> */}
                        {comment.username}:
                      </div>
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
      user: user ? user : null,
    },
  };
}
