export const BorrowedQueries = {
  createBorrowed: `
      INSERT INTO borrowed("userid", "bookid", "userborrowedid", "nonusername", "comment", "created", "until", "returned")
      VALUES ($1, $2, $3, $4, $5, $6, $7, false)
      RETURNING *;`,
};
