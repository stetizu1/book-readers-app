export const authorQueries = {
  createAuthor: `
      INSERT INTO author("name")
      VALUES ($1)
      RETURNING *;`,
};
