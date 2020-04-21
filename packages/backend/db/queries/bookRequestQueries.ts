export const bookRequestQueries = {
  /**
   * Accepting: [bookDataId, userId, userBookingId, comment, createdByBookingUser]
   */
  createBookRequest: `
      INSERT INTO book_request("bookdataid", "userid", "userbookingid", "comment", "createdbybookinguser")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,

  /**
   * Accepting: [bookDataId]
   */
  getBookRequestByBookDataId: `
      SELECT *
      FROM book_request
      WHERE bookdataid = $1;`,

  /**
   * Accepting: []
   */
  getAllBookRequests: `
      SELECT *
      FROM book_request;`,

  /**
   * Accepting: [bookDataId, userBookingId, comment]
   */
  updateBookRequest: `
      UPDATE book_request
      SET userbookingid = $2,
          comment       = $3
      WHERE bookdataid = $1
      RETURNING *;`,

  /**
   * Accepting: [userBookingId]
   */
  deleteRequestsCreatedByDeletedUser: `
      DELETE
      FROM book_request
      WHERE createdbybookinguser = TRUE
        AND userbookingid = $1; `,

  /**
   * Accepting: [bookDataId]
   */
  deleteBookRequest: `
      DELETE
      FROM book_request
      WHERE bookdataid = $1;`,
};
