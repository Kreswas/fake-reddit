const subreddits = [
  { topic: 'Survival' },
  { topic: 'Shooter' },
  { topic: 'Horror' },
  { topic: 'RPG' },
  { topic: 'Online/Multiplayer' },
  { topic: 'MMO' },
  { topic: 'Simulation' },
  { topic: 'Strategy' },
  { topic: 'Sports' },
  { topic: 'Platform' },
];
exports.up = async (sql) => {
  await sql`
   INSERT INTO subreddits ${sql(subreddits, 'topic')}`;
};
exports.down = async (sql) => {
  for (const subreddit of subreddits) {
    await sql`
    DELETE FROM
     subreddits
    WHERE
     topic=${subreddit.topic}
     `;
  }
};
