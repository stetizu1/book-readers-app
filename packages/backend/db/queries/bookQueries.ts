export const bookQueries = {
  /**
   * Accepting: [name]
   */
  createBook: `
      INSERT INTO book(name)
      VALUES ($1)
      RETURNING *;`,

  /**
   * Accepting: [bookId, authorId]
   */
  createWrittenBy: `
      INSERT INTO written_by(bookid, authorid)
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
   * Accepting: [name]
   */
  getBookByName: `
      SELECT *
      FROM book
      WHERE name = $1;`,

  /**
   * Accepting: [bookId]
   */
  getAuthorsIdsByBookId: `
      SELECT *
      FROM written_by
      WHERE bookid = $1;`,

  /**
   * Accepting: [bookName, authorId]
   */
  getBookByNameAndAuthorId: `
      SELECT *
      FROM written_by JOIN book b on written_by.bookid = b.id
      WHERE name = $1
        AND authorid = $2;`,

  /**
   * Accepting: []
   */
  getAllBooks: `
      SELECT *
      FROM book;`,
};
