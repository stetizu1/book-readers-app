export const reviewQueries = {
  createReview: `
      INSERT INTO review("bookdataid", "stars", "comment")
      VALUES ($1, $2, $3)
      RETURNING *;`,

  getReviewByBookDataId: `
      SELECT *
      FROM review
      WHERE bookdataid = $1;`,

  getAllReviews: `
      SELECT *
      FROM review;`,

  updateReview: `
      UPDATE review
      SET stars   = $2,
          comment = $3
      WHERE bookdataid = $1
      RETURNING *;`,

  deleteReview: `
      DELETE
      FROM review
      WHERE bookdataid = $1
      RETURNING *;`,
};
