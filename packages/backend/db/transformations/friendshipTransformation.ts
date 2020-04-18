import { Friendship } from 'book-app-shared/types/Friendship';

import { CreateFromDbRow } from '../../types/db/TransformationTypes';


export const createFriendshipFromDbRow: CreateFromDbRow<Friendship> = (row) => ({
  fromUserId: row.fromuserid,
  toUserId: row.touserid,
  confirmed: row.confirmed,
});
