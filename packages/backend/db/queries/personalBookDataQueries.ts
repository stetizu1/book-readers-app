export const personalBookDataQueries = {
  createPersonalBookData: `
      INSERT INTO personal_book_data("bookdataid", "dateread", "comment")
      VALUES ($1, $2, $3)
      RETURNING *;`,

  getPersonalBookDataByBookDataId: `
      SELECT *
      FROM personal_book_data
      WHERE bookdataid = $1;`,
};
