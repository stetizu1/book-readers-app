export const personalBookDataQueries = {
  createPersonalBookData: `
      INSERT INTO personal_book_data("bookdataid", "dateread", "comment")
      VALUES ($1, $2, $3)
      RETURNING *;`,

  getPersonalBookDataByBookDataId: `
      SELECT *
      FROM personal_book_data
      WHERE bookdataid = $1;`,

  updatePersonalBookData: `
      UPDATE personal_book_data
      SET dateread = $2,
          comment  = $3
      WHERE bookdataid = $1
      RETURNING *;`,

  deletePersonalBookData: `
      DELETE
      FROM personal_book_data
      WHERE bookdataid = $1
      RETURNING *;`,
};
