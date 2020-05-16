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
   * Accepting: [email]
   */
  getUserByEmail: `
      SELECT *
      FROM user_data
      WHERE email = $1;`,

  /**
   * Accepting: [userId]
   */
  getAllFriendUsers: `
      SELECT u.id, u.email, u.publicprofile, u.name, u.description, u.image
      FROM user_data AS u
               JOIN friendship f ON (u.id = f.fromuserid OR u.id = f.touserid)
      WHERE (f.touserid = $1 OR f.fromuserid = $1)
        AND u.id != $1;`,

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
