exports.up = async (sql) => {
  await sql`CREATE TABLE posts(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(50) NOT NULL,
  body varchar(400),
  subreddits_id integer REFERENCES subreddits(id),
  image varchar(300),
  user_id integer REFERENCES users(id)
);`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE posts`;
};
