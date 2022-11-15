exports.up = async (sql) => {
  await sql`CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  posts_id varchar(50) NOT NULL,
  text varchar(400),
  user_id integer REFERENCES users(id)
);`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE comments`;
};
