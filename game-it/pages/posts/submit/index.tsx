import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
        <div>
          <h1>Create a post</h1>
          <div>
            <input type="file" name="image" onChange={uploadImage} />
            <div>
              <img src={image} className="w-full" alt="" />
            </div>
          </div>

          <input
            placeholder="Title"
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
            required
            value={bodyInput}
            onChange={(post) => {
              setBodyInput(post.currentTarget.value);
            }}
          />

          <br />

          <div>
            <label> Topic/Genre: </label>
            <select
              className="search-dark"
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

          <div>
            {' '}
            <button
              onClick={async () => {
                await createPostFromApi();
              }}
            >
              submit
            </button>
            <button
              onClick={() => {
                clearStatus();
              }}
            >
              clear
            </button>
          </div>

          <hr />

          <h2>Your Past Posts.</h2>
          <hr className="my-2 h-px bg-gray-200 border-0 dark:bg-gray-700" />
        </div>
        <div className="mt-5 space-y-5">
          {/* <input
            placeholder="search"
            onChange={(e) => {
              if (filteredPosts.length <= 0) {
                setFilteredPosts(posts);
              }

              if (e.currentTarget.value.length <= 0) {
                setPosts(filteredPosts);
              } else {
                const filteredPost = posts.filter((post) => {
                  return post.title.includes(e.currentTarget.value);
                });

                setPosts(filteredPost);
              }
            }}
          /> */}
          {posts?.map((post) => {
            return (
              <div
                className="border-solid border-2 border-black rounded"
                key={`postId-${post.id}`}
              >
                <div>Post Name: {post.title} </div>
                <div>
                  <button
                    onClick={() => {
                      edit(post.id);
                    }}
                  >
                    edit
                  </button>
                  <a
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
