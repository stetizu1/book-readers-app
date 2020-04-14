export const AuthorQueries = {
  createAuthor: `
      INSERT INTO author("name")
      VALUES ($1)
      RETURNING *;`,

  getAuthorByName: `
      SELECT *
      FROM author
      WHERE name = $1;`,

  getAuthorById: `
      SELECT *
      FROM author
      WHERE id = $1;`,

  getAllAuthors: `
      SELECT *
      FROM author`,

};
