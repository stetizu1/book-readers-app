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

  updateUserWithoutPasswordChange: `
      UPDATE user_data
      SET publicprofile = $2,
          name          = $3,
          description   = $4,
          image         = $5
      WHERE id = $1
      RETURNING id, email, publicprofile, name, description, image;`,

  updateUserWithPasswordChange: `
      UPDATE user_data
      SET publicprofile = $2,
          name          = $3,
          description   = $4,
          image         = $5,
          password      = $6
      WHERE id = $1
      RETURNING id, email, publicprofile, name, description, image;`,

  deleteUser: `
      DELETE
      FROM user_data
      WHERE id = $1;`,
};
