export const userQueries = {
  /**
   * Accepting: [email, publicProfile, password, name, description, image]
   */
  createUser: `
      INSERT INTO user_data(email, publicprofile, password, name, description, image)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, publicprofile, name, description, image;`,

  /**
   * Accepting: [id]
   */
  getUserById: `
      SELECT *
      FROM user_data
      WHERE id = $1;`,

  /**
   * Accepting: []
   */
  getAllUsers: `
      SELECT *
      FROM user_data;`,

  /**
   * Accepting: [id, publicProfile, name, description, image]
   */
  updateUserWithoutPasswordChange: `
      UPDATE user_data
      SET publicprofile = $2,
          name          = $3,
          description   = $4,
          image         = $5
      WHERE id = $1
      RETURNING id, email, publicprofile, name, description, image;`,

  /**
   * Accepting: [id, publicProfile, name, description, image, password]
   */
  updateUserWithPasswordChange: `
      UPDATE user_data
      SET publicprofile = $2,
          name          = $3,
          description   = $4,
          image         = $5,
          password      = $6
      WHERE id = $1
      RETURNING id, email, publicprofile, name, description, image;`,

  /**
   * Accepting: [id]
   */
  deleteUser: `
      DELETE
      FROM user_data
      WHERE id = $1
      RETURNING id, email, publicprofile, name, description, image;`,
};
