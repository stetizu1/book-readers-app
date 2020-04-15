import { Friendship } from 'book-app-shared/types/Friendship';

import { CreateFromDbRow } from '../createFromDbRow';


export const createFriendshipFromDbRow: CreateFromDbRow<Friendship> = (row) => ({
  fromUserId: row.fromuserid,
  toUserId: row.touserid,
  confirmed: row.confirmed,
});
