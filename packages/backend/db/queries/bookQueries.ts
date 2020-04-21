export const bookQueries = {
  /**
   * Accepting: [name]
   */
  createBook: `
      INSERT INTO book("name")
      VALUES ($1)
      RETURNING *;`,

  /**
   * Accepting: [bookId, authorId]
   */
  createWrittenBy: `
      INSERT INTO written_by("bookid", "authorid")
      VALUES ($1, $2)
      RETURNING *;`,

  /**
   * Accepting: [id]
   */
  getBookById: `
      SELECT *
      FROM book
      WHERE id = $1;`,

  /**
   * Accepting: [bookId]
   */
  getAuthorsIdsByBookId: `
      SELECT *
      FROM written_by
      WHERE bookid = $1;`,

  /**
   * Accepting: [authorId, bookName]
   */
  getBookByAuthorIdAndName: `
      SELECT *
      FROM written_by JOIN book b on written_by.bookid = b.id
      WHERE authorid = $1
        AND name = $2;`,

  /**
   * Accepting: []
   */
  getAllBooks: `
      SELECT *
      FROM book;`,
};
