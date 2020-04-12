import { QueryResultRow } from 'pg';

import { Friendship } from 'book-app-shared/types/Friendship';


export const createFriendshipFromDbRow = (row: QueryResultRow): Friendship => ({
  fromUserId: row.fromuserid,
  toUserId: row.touserid,
  confirmed: row.confirmed,
});
