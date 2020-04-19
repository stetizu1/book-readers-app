export const borrowedQueries = {
  createBorrowed: `
      INSERT INTO borrowed("userid", "bookdataid", "userborrowedid", "nonusername", "comment", "until", "created",
                           "returned")
      VALUES ($1, $2, $3, $4, $5, $6, $7, false)
      RETURNING *;`,

  getBorrowedByBookDataId: `
      SELECT *
      FROM borrowed
      WHERE bookdataid = $1;`,

  getAllBorrowed: `
      SELECT *
      FROM borrowed;`,

  updateBorrowed: `
      UPDATE borrowed
      SET returned       = $2,
          userborrowedid = $3,
          nonusername    = $4,
          comment        = $5,
          until          = $6
      WHERE bookdataid = $1
      RETURNING *;`,
};
