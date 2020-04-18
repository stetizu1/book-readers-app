export const BookDataQueries = {
  createBookData: `
      INSERT INTO book_data("bookid", "userid", "publisher", "yearpublished", "isbn", "image", "format", "genreid")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;`,

  getBookDataById: `
      SELECT *
      FROM book_data
      WHERE id = $1;`,

  getAllBookData: `
      SELECT *
      FROM book_data`,
};
