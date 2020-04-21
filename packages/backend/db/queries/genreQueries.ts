export const genreQueries = {
  /**
   * Accepting: [id]
   */
  getGenreById: `
      SELECT *
      FROM genre
      WHERE id = $1;`,

  /**
   * Accepting: []
   */
  getAllGenres: `
      SELECT *
      FROM genre;`,
};
