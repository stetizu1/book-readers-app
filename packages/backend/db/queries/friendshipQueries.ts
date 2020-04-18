export const friendshipQueries = {
  createFriendship: `
      INSERT INTO friendship("fromuserid", "touserid", "confirmed")
      VALUES ($1, $2, false)
      RETURNING *;`,

  getFriendshipByIds: `
      SELECT *
      FROM friendship
      WHERE (fromuserid = $1 AND touserid = $2)
        OR (fromuserid = $2 AND touserid = $1);`,

  getAllFriendships: `
      SELECT *
      FROM friendship;`,
};
