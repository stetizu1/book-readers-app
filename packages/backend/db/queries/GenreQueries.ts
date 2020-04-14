export const GenreQueries = {
  getGenreById: `
      SELECT *
      FROM genre
      WHERE id = $1;`,
};
