export const reviewQueries = {
  createReview: `
      INSERT INTO review("bookdataid", "stars", "comment")
      VALUES ($1, $2, $3)
      RETURNING *;`,

  getReviewByBookDataId: `
      SELECT *
      FROM personal_book_data
      WHERE bookdataid = $1;`,

  getAllReviews: `
      SELECT *
      FROM personal_book_data;`,
};
