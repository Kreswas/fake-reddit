exports.up = async (sql) => {
  await sql`CREATE TABLE posts(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(50) NOT NULL,
  body varchar(400),
  post_date TIMESTAMP NOT NULL DEFAULT NOW(),
  subreddits_id integer REFERENCES subreddits(id),
  user_id integer REFERENCES users(id),
  image varchar(300)
);`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE posts`;
};
