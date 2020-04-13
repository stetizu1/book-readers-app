export const HasLabelQueries = {
  createHasLabel: `
      INSERT INTO has_label("bookdataid", "labelid")
      VALUES ($1, $2)
      RETURNING *;`,
};
