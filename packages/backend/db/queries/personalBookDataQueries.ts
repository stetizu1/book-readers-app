export const personalBookDataQueries = {
  createPersonalBookData: `
      INSERT INTO personal_book_data("bookdataid", "dateread", "comment")
      VALUES ($1, $2, $3)
      RETURNING *;`,
};
