export const personalBookDataQueries = {
  /**
   * Accepting: [bookDataId, dateRead, comment]
   */
  createPersonalBookData: `
      INSERT INTO personal_book_data("bookdataid", "dateread", "comment")
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
