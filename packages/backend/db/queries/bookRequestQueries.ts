export const bookRequestQueries = {
  createBookRequest: `
      INSERT INTO book_request("bookdataid", "userid", "userbookingid", "comment", "createdbybookinguser")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,

  getBookRequestByBookDataId: `
      SELECT *
      FROM book_request
      WHERE bookdataid = $1;`,

  getAllBookRequests: `
      SELECT *
      FROM book_request;`,

  updateBookRequest: `
      UPDATE book_request
      SET userbookingid = $2,
          comment       = $3
      WHERE bookdataid = $1
      RETURNING *;`,

  deleteRequestsCreatedByDeletedUser: `
      DELETE
      FROM book_request
      WHERE createdbybookinguser = TRUE
        AND userbookingid = $1; `,
};
