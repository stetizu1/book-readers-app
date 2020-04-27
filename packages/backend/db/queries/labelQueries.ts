export const labelQueries = {
  /**
   * Accepting: [userId, name, description]
   */
  createLabel: `
      INSERT INTO label(userid, name, description)
      VALUES ($1, $2, $3)
      RETURNING *;`,

  /**
   * Accepting: [id]
   */
  getLabelById: `
      SELECT *
      FROM label
      WHERE id = $1;`,

  /**
   * Accepting: [userId]
   */
  getAllLabels: `
      SELECT *
      FROM label
      WHERE userid = $1;`,

  /**
   * Accepting: [id, name, description]
   */
  updateLabel: `
      UPDATE label
      SET name        = $2,
          description = $3
      WHERE id = $1
      RETURNING *;`,

  /**
   * Accepting: [id]
   */
  deleteLabel: `
      DELETE
      FROM label
      WHERE id = $1
      RETURNING *;`,
};
