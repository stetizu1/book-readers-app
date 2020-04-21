export const borrowedQueries = {
  /**
   * Accepting: [bookDataId, userBorrowedId, nonUsername, comment, until, created]
   */
  createBorrowed: `
      INSERT INTO borrowed("bookdataid", "userborrowedid", "nonusername",
                           "comment", "until", "created", "returned")
      VALUES ($1, $2, $3, $4, $5, $6, false)
      RETURNING *;`,

  /**
   * Accepting: [id]
   */
  getBorrowedById: `
      SELECT *
      FROM borrowed
      WHERE id = $1;`,

  /**
   * Accepting: []
   */
  getAllBorrowed: `
      SELECT *
      FROM borrowed;`,

  /**
   * Accepting: [id, returned, userBorrowedId, nonUserName, comment, until]
   */
  updateBorrowed: `
      UPDATE borrowed
      SET returned       = $2,
          userborrowedid = $3,
          nonusername    = $4,
          comment        = $5,
          until          = $6
      WHERE id = $1
      RETURNING *;`,

  /**
   * Accepting: [id]
   */
  deleteBorrowed: `
      DELETE
      FROM borrowed
      WHERE id = $1
      RETURNING *;`,
};
