export const bookDataQueries = {
  /**
   * Accepting: [bookId, userId, publisher, yearPublished, isbn, image, format, genreId]
   */
  createBookData: `
      INSERT INTO book_data("bookid", "userid", "publisher", "yearpublished", "isbn", "image", "format", "genreid")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;`,

  /**
   * Accepting: [id]
   */
  getBookDataById: `
      SELECT *
      FROM book_data
      WHERE id = $1;`,

  /**
   * Accepting [userId]
   */
  getAllBookData: `
      SELECT *
      FROM book_data
      WHERE userid = $1;`,

  /**
   * Accepting: [id, userId, publisher, yearPublished, isbn, image, format, genreId]
   */
  updateBookData: `
      UPDATE book_data
      SET userid        = $2,
          publisher     = $3,
          yearpublished = $4,
          isbn          = $5,
          image         = $6,
          format        = $7,
          genreid       = $8
      WHERE id = $1
      RETURNING *;`,

  /**
   * Accepting: [id]
   */
  deleteBookData: `
      DELETE
      FROM book_data
      WHERE id = $1
      RETURNING *;`,
};
