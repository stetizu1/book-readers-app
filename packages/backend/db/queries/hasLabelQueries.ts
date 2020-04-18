export const hasLabelQueries = {
  createHasLabel: `
      INSERT INTO has_label("bookdataid", "labelid")
      VALUES ($1, $2)
      RETURNING *;`,

  getHasLabelsByBookDataId: `
      SELECT *
      FROM has_label
      WHERE has_label.bookdataid = $1;`,

};
