import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
import { getPostByLoggedInUser, Post } from '../../../database/post';
import { getSubreddits, Subreddit } from '../../../database/subreddit';
import { getUserBySessionToken } from '../../../database/users';

type UserHier = {
  id: number;
  username: string;
};

type Props = {
  subredditsList: Subreddit[];
  postsss: Post[];
  user: UserHier;
  cloudinaryAPI: string | undefined;
};

export default function Admin(props: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postTitleInput, setPostTitleInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [image, setImage] = useState('');
  const [subredditIdInput, setSubredditIdInput] = useState(0);
  const [onEditId, setOnEditId] = useState<number>(0);
  // const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // // cloudinary part
  const uploadImage = async (post: any) => {
    const files = post.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'atfji7tr');

    const response = await fetch(
      `	https://api.cloudinary.com/v1_1/${props.cloudinaryAPI}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await response.json();

    setImage(file.secure_url);
  };

  // calling all posts from the database
  async function getPostsFromApi() {
    setPosts(props.postsss);
  }

  async function createPostFromApi() {
    if (onEditId > 0) {
      updatePostFromApiById();
    } else {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          userId: props.user.id.toString(),
          image: image,
          postTitle: postTitleInput,
          body: bodyInput,
          subredditId: subredditIdInput,
        }),
      });

      const postFromApi = (await response.json()) as Post;
      const newState = [...posts, postFromApi];

      setPosts(newState);
      clearStatus();
    }
  }

  async function deletePostFromApiById(id: number) {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    const deletedPost = (await response.json()) as Post;

    const filteredPost = posts.filter((post) => {
      return post.id !== deletedPost.id;
    });

    setPosts(filteredPost);
  }

  async function updatePostFromApiById() {
    const id = onEditId;
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        postId: onEditId.toString(),
        image: image,
        postTitle: postTitleInput,
        body: bodyInput,
        subredditId: subredditIdInput,
      }),
    });
    const updatedPostFromApi = (await response.json()) as Post;

    const newState = posts.map((post) => {
      if (post.id === updatedPostFromApi.id) {
        return updatedPostFromApi;
      } else {
        return post;
      }
    });
    clearStatus();
    setPosts(newState);
  }
  async function edit(id: number) {
    const e = posts.find((e) => e.id === id);
    if (e) {
      setPostTitleInput(e.title);
      setImage(e.image);
      setBodyInput(e.body);
      setSubredditIdInput(e.subredditsId);
      setOnEditId(e.id);
    } else {
      alert('post not found id: ' + id);
    }
  }
  function clearStatus() {
    setOnEditId(0);
    setPostTitleInput('');
    setBodyInput('');
    setImage('');
    setSubredditIdInput(0);
  }

  useEffect(() => {
    getPostsFromApi().catch((err) => {
      console.log(err);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Submit to GameIt</title>
        <meta name="body" content=" Submit form " />
      </Head>
      <div>
        <div
          className="
       position-relative;
      width-100%;
      display-block;"
        >
          <div className="flex flex-col items-center">
            <h1 className="mt-10 mb-5 text-2xl">Create a post</h1>
            <div>
              <h2 className="text-lg">Upload an image:</h2>
              <input
                type="file"
                name="image"
                onChange={uploadImage}
                className=" border rounded-t-sm"
              />
              <img
                src={image}
                className="max-h-96 m-w-150 text-center text-gray-500"
                // alt="Image Preview"
              />
            </div>
          </div>

          <div className="flex flex-col mx-80 border rounded-md post">
            <input
              placeholder="Title"
              className="mt-5 surface mx-3 py-1.5 rounded-md border px-2"
              value={postTitleInput}
              required
              onChange={(post) => {
                setPostTitleInput(post.currentTarget.value);
              }}
            />

            <br />

            <br />
            <textarea
              placeholder="Text (optional)"
              // required
              className="border rounded-md surface mx-3 py-1.5 px-2"
              value={bodyInput}
              onChange={(post) => {
                setBodyInput(post.currentTarget.value);
              }}
            />

            <br />

            <div className="ml-3">
              <label>
                <strong> Topic/Genre: </strong>
              </label>
              <select
                className="border-0 cursor-pointer rounded-md drop-shadow-md search-dark duration-300 hover:bg-blue-900 focus:bg-blue-800"
                required
                value={subredditIdInput}
                onChange={(post) => {
                  setSubredditIdInput(Number(post.currentTarget.value));
                }}
              >
                <option>Select a topic </option>
                {props.subredditsList?.map((subreddit) => {
                  return (
                    <option
                      value={subreddit.id}
                      key={`subredditsList-${subreddit.id}`}
                    >
                      {subreddit.topic}
                    </option>
                  );
                })}
              </select>
            </div>

            <br />
            <br />

            <div className="flex flex-row-reverse gap-1.5 mb-2">
              <button
                className="border-2 border-blue-600 rounded-lg px-3 py-2 text-blue-400 cursor-pointer hover:bg-blue-600 hover:text-blue-200 duration-500 mr-2"
                onClick={async () => {
                  await createPostFromApi();
                }}
              >
                submit
              </button>
              <button
                className="border-2 border-red-600 rounded-lg px-3 py-2 text-red-400 cursor-pointer hover:bg-red-600 hover:text-red-200 duration-500"
                onClick={() => {
                  clearStatus();
                }}
              >
                clear
              </button>
            </div>
          </div>
          <br />
          <hr />

          <h2>Your Past Posts.</h2>
          <hr className="my-2 h-px bg-gray-200 border-0 dark:bg-gray-700 " />
        </div>
        <div className="mt-5 space-y-5">
          {posts?.map((post) => {
            return (
              <div
                className="border-solid border-2 border-gray-500 rounded-md mx-32"
                key={`postId-${post.id}`}
              >
                <div className="flex">
                  <TimeAgo date={post.postDate} className="text-xs flex-end" />
                </div>
                <a href={`/posts/${post.id}`}>
                  <div className="mb-2 flex">
                    Post Title: <br />
                    {post.title}{' '}
                    {/* <TimeAgo date={post.postDate} className="text-xs flex-end" /> */}
                  </div>
                  <hr />
                  <div className="mb-2">{post.body}</div>
                </a>
                <div className="flex gap-1.5 mb-2">
                  <hr className="border-dashed" />
                  <button
                    className="border-2 border-blue-600 rounded-lg px-3 py-2 text-blue-400 cursor-pointer hover:bg-blue-600 hover:text-blue-200 duration-500 "
                    onClick={() => {
                      edit(post.id);
                    }}
                  >
                    edit
                  </button>
                  <a
                    className="border-2 border-red-600 rounded-lg px-3 py-2 text-white cursor-pointer bg-red-900 hover:bg-red-600 hover:text-red-200 duration-500"
                    onClick={async () => {
                      const result = confirm('Want to delete?');
                      if (result) {
                        await deletePostFromApiById(post.id);
                      }
                    }}
                  >
                    <button>DELETE</button>
                  </a>
                </div>
              </div>
            );
          })}
          <br />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<Props>> {
  const token = context.req.cookies.sessionToken;
  const user = token && (await getUserBySessionToken(token));
  const cloudinaryAPI = process.env.CLOUDINARY_NAME;
  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/private-profile',
        permanent: false,
      },
    };
  }
  const postsByLoggedInUser = user && (await getPostByLoggedInUser(user.id));
  const subredditsList = await getSubreddits();

  return {
    props: {
      subredditsList: subredditsList,
      postsss: JSON.parse(JSON.stringify(postsByLoggedInUser)),
      user: user,
      cloudinaryAPI: cloudinaryAPI,
    },
  };
}
