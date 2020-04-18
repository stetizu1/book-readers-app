export const labelQueries = {
  createLabel: `
      INSERT INTO label(userid, name, description)
      VALUES ($1, $2, $3)
      RETURNING *;`,

  getLabelById: `
      SELECT *
      FROM label
      WHERE id = $1;`,

  getAllLabels: `
      SELECT *
      FROM label;`,
};
