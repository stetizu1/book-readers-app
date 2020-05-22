export const friendshipQueries = {
  /**
   * Accepting: [fromUserId, toUserId, confirmed]
   */
  createFriendship: `
      INSERT INTO friendship(fromuserid, touserid, confirmed)
      VALUES ($1, $2, false)
      RETURNING *;`,

  /**
   * Accepting: [userId, userId]
   */
  getFriendshipByIds: `
      SELECT *
      FROM friendship
      WHERE (fromuserid = $1 AND touserid = $2)
         OR (fromuserid = $2 AND touserid = $1);`,

  /**
   * Accepting: [userId, userId]
   */
  getConfirmedFriendshipByIds: `
      SELECT *
      FROM friendship
      WHERE ((fromuserid = $1 AND touserid = $2) OR (fromuserid = $2 AND touserid = $1))
        AND confirmed = TRUE;`,

  /**
   * Accepting: [userId]
   */
  getAllFriendships: `
      SELECT *
      FROM friendship
      WHERE fromuserid = $1
         OR touserid = $1;`,

  /**
   * Accepting: [toUserId, fromUserId, confirmed]
   */
  updateFriendship: `
      UPDATE friendship
      SET confirmed = $3
      WHERE touserid = $1
        AND fromuserid = $2
      RETURNING *;`, // only user asked can confirm

  /**
   * Accepting: [userId, userId]
   */
  deleteFriendship: `
      DELETE
      FROM friendship
      WHERE (fromuserid = $1 AND touserid = $2)
         OR (fromuserid = $2 AND touserid = $1)
      RETURNING *;`,
};
