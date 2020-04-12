export const FriendshipQueries = {
  createFriendship: `
      INSERT INTO friendship("fromuserid", "touserid", "confirmed")
      VALUES ($1, $2, false)
      RETURNING *;`,
};
