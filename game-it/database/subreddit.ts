import { sql } from './connect';

export type Subreddit = {
  id: number;
  topic: string;
};

export async function getSubreddits() {
  const subreddits = await sql<Subreddit[]>`
SELECT * FROM subreddits;
`;
  return subreddits;
}

export async function getSubredditsById(id: number) {
  const [subreddit] = await sql<Subreddit[]>`
  SELECT * FROM subreddits WHERE id=${id}`;

  return subreddit;
}
