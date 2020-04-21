export const authorQueries = {
  /**
   * Accepting: [name]
   */
  createAuthor: `
      INSERT INTO author("name")
      VALUES ($1)
      RETURNING *;`,

  /**
   * Accepting: [name]
   */
  getAuthorByName: `
      SELECT *
      FROM author
      WHERE name = $1;`,

  /**
   * Accepting: [id]
   */
  getAuthorById: `
      SELECT *
      FROM author
      WHERE id = $1;`,

  /**
   * Accepting: []
   */
  getAllAuthors: `
      SELECT *
      FROM author;`,

};
