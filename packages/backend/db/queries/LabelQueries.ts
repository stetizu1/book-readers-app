export const LabelQueries = {
  createLabel: `
      INSERT INTO label(userid, name, description)
      VALUES ($1, $2, $3)
      RETURNING *;`,
};
