export const ReviewQueries = {
  createReview: `
      INSERT INTO review("bookdataid", "stars", "comment")
      VALUES ($1, $2, $3)
      RETURNING *;`,
};
