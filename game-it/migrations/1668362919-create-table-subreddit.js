exports.up = async (sql) => {
  await sql`CREATE TABLE subreddits(
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      topic varchar(70) NOT NULL
    );
    `;
};
exports.down = async (sql) => {
  await sql`DROP TABLE subreddits
    `;
};
