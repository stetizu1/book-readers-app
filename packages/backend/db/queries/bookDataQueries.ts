export const bookDataQueries = {
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
      FROM book_data;`,

  updateBookData: `
      UPDATE book_data
      SET 
          userid = $2,
          publisher = $3,
          yearpublished = $4,
          isbn = $5,
          image = $6,
          format = $7,
          genreid = $8
      WHERE id = $1
      RETURNING *;`,
};
