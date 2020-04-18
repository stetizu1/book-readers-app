export const bookQueries = {
  createBook: `
      INSERT INTO book("name")
      VALUES ($1)
      RETURNING *;`,

  createWrittenBy: `
      INSERT INTO written_by("bookid", "authorid")
      VALUES ($1, $2)
      RETURNING *;`,

  getBookById: `
      SELECT *
      FROM book
      WHERE id = $1;`,

  getAuthorsIdsByBookId: `
      SELECT *
      FROM  written_by
      WHERE bookid = $1;`,

  getAllBooks: `
      SELECT *
      FROM book;`,
};
