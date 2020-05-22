export const personalBookDataQueries = {
  /**
   * Accepting: [bookDataId, dateRead, comment]
   */
  createPersonalBookData: `
      INSERT INTO personal_book_data(bookdataid, dateread, comment)
      VALUES ($1, $2, $3)
      RETURNING *;`,

  /**
   * Accepting: [bookDataId]
   */
  getPersonalBookDataByBookDataId: `
      SELECT *
      FROM personal_book_data
      WHERE bookdataid = $1;`,

  /**
   * Accepting: [userId]
   */
  getAllPersonalBookData: `
      SELECT bookdataid, dateread, comment
      FROM personal_book_data
               JOIN book_data bd ON personal_book_data.bookdataid = bd.id
      WHERE bd.userid = $1;`,

  /**
   * Accepting: [bookDataId, dateRead, comment]
   */
  updatePersonalBookData: `
      UPDATE personal_book_data
      SET dateread = $2,
          comment  = $3
      WHERE bookdataid = $1
      RETURNING *;`,

  /**
   * Accepting: [bookDataId]
   */
  deletePersonalBookData: `
      DELETE
      FROM personal_book_data
      WHERE bookdataid = $1
      RETURNING *;`,
};
