import { Friendship } from 'book-app-shared/types/Friendship';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertDbRowToFriendship: ConvertDbRow<Friendship> = (row) => ({
  fromUserId: row.fromuserid,
  toUserId: row.touserid,
  confirmed: row.confirmed,
});
