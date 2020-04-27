export const reviewQueries = {
  /**
   * Accepting: [bookDataId, stars, comment]
   */
  createReview: `
      INSERT INTO review("bookdataid", "stars", "comment")
      VALUES ($1, $2, $3)
      RETURNING *;`,

  /**
   * Accepting: [bookDataId]
   */
  getReviewByBookDataId: `
      SELECT *
      FROM review
      WHERE bookdataid = $1;`,

  /**
   * Accepting: [userId]
   */
  getAllReviews: `
      SELECT bookdataid, stars, comment
      FROM review
               JOIN book_data bd ON review.bookdataid = bd.id
      WHERE bd.userid = $1;`,

  /**
   * Accepting: [bookDataId, stars, comment]
   */
  updateReview: `
      UPDATE review
      SET stars   = $2,
          comment = $3
      WHERE bookdataid = $1
      RETURNING *;`,

  /**
   * Accepting: [bookDataId]
   */
  deleteReview: `
      DELETE
      FROM review
      WHERE bookdataid = $1
      RETURNING *;`,
};
