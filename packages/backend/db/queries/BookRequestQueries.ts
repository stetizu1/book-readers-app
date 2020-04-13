export const BookRequestQueries = {
  createBookRequest: `
      INSERT INTO book_request("bookid", "userid", "userbookingid", "comment", "createdbybookinguser")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,
};
