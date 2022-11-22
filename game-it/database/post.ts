import { sql } from './connect';

export type Post = {
  id: number;
  title: string;
  body: string;
  image: string;
  postDate: string;
  subredditsId: number;
  userId: number;
};
export type PostDTO = {
  id: number;
  title: string;
  body: string;
  image: string;
  postDate: string;
  subredditsId: number;
  topic: string;
  userId: number;
  username: string;
};

export async function getPost() {
  const posts = await sql<Post[]>`
  SELECT * FROM posts inner join subreddits on posts.subreddits_id=subreddits.id;
`;
  return posts;
}

export async function getPostsWithJoint() {
  const posts = await sql<PostDTO[]>`
  SELECT posts.id, posts.image, posts.title, posts.body, posts.post_date, posts.subreddits_id, posts.user_id, subreddits.topic, users.username
  FROM posts inner join subreddits on posts.subreddits_id=subreddits.id inner join users on posts.user_id =users.id
  ORDER BY posts.id DESC;
`;
  return posts;
}
// for subreddit on the posts page
export async function getPostsWithJointBySubredditsId(id: number) {
  const posts = await sql<PostDTO[]>`
  SELECT posts.id, posts.image, posts.title, posts.body, posts.post_date, posts.subreddits_id, posts.user_id,  subreddits.topic, users.username
  FROM posts inner join subreddits on posts.subreddits_id=subreddits.id inner join users on posts.user_id =users.id
  WHERE posts.subreddits_id=${id};
`;
  return posts;
}

export async function getPostById(id: number) {
  const [post] = await sql<Post[]>`
  SELECT * FROM posts WHERE id=${id}`;

  return post;
}

export async function getPostByLoggedInUser(id: number) {
  const posts = await sql<Post[]>`
  SELECT * FROM posts where user_id=${id}
  ORDER BY posts.id DESC;
`;
  return posts;
}

// Get a single post by id and valid session token
export async function getPostByIdAndValidSessionToken(
  id: number,
  token: string | undefined,
) {
  if (!token) return undefined;
  const [post] = await sql<Post[]>`
    SELECT
      posts.*
    FROM
      posts,
      sessions
    WHERE
      sessions.token = ${token}
    AND
      sessions.expiry_timestamp > now()
    AND
      posts.id = ${id}
  `;
  return post;
}
// just to try do not push
export async function getFoundPostById(id: number) {
  if (!id) return undefined;
  const [post] = await sql<PostDTO[]>`
  SELECT posts.id, posts.image, posts.title, posts.body, posts.post_date, posts.subreddits_id, posts.user_id,  subreddits.topic, users.username
  FROM posts inner join subreddits on posts.subreddits_id=subreddits.id inner join users on posts.user_id = users.id
  WHERE posts.id=${id};
  `;
  return post;
}

export async function createPost(
  image: string,
  title: string,
  body: string,
  subredditsId: number,
  userId: number,
) {
  const [post] = await sql<Post[]>`
    INSERT INTO posts
      ( image,
        title,
        body,
        subreddits_id,
        user_id
       )
    VALUES
      (${image}, ${title}, ${body}, ${subredditsId},${userId})
    RETURNING *
  `;
  return post;
}

export async function updatePostById(
  id: number,
  image: string,
  title: string,
  body: string,
  subredditsId: number,
) {
  const [post] = await sql<Post[]>`
    UPDATE
      posts
    SET
    image = ${image},
    title = ${title},
    body = ${body},
    subreddits_id=${subredditsId},
    WHERE
      id = ${id}
    RETURNING *
  `;
  return post;
}

export async function deletePostById(id: number) {
  const [post] = await sql<Post[]>`
    DELETE FROM
      posts
    WHERE
      id = ${id}
    RETURNING *
  `;
  return post;
}

// add
// (${image},${title}, ${body}, ${subredditsId},${userId})
