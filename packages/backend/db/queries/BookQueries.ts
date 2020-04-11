export const BookQueries = {
  createBook: `
      INSERT INTO book("name")
      VALUES ($1)
      RETURNING *;`,

  createWrittenBy: `
      INSERT INTO written_by("bookid", "authorid")
      VALUES ($1, $2)
      RETURNING *;`,
};
