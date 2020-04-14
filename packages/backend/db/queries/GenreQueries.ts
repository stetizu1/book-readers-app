export const GenreQueries = {
  getGenreById: `
      SELECT *
      FROM genre
      WHERE id = $1;`,
  getAllGenres: `
      SELECT *
      FROM genre`,
};
