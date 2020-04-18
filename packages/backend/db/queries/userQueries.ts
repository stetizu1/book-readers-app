export const userQueries = {
  createUser: `
      INSERT INTO user_data(email, publicprofile, password, name, description, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, publicprofile, name, description, image;`,

  getUserById: `
      SELECT *
      FROM user_data
      WHERE id = $1;`,

  getAllUsers: `
      SELECT *
      FROM user_data;`,
};
