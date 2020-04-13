export const BorrowedQueries = {
  createBorrowed: `
      INSERT INTO borrowed("userid", "bookdataid", "userborrowedid", "nonusername", "comment", "until", "created", "returned")
      VALUES ($1, $2, $3, $4, $5, $6, $7, false)
      RETURNING *;`,
};
