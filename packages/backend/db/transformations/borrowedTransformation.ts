import { Borrowed } from 'book-app-shared/types/Borrowed';

import { CreateFromDbRow } from '../../types/db/TransformationTypes';


export const createBorrowedFromDbRow: CreateFromDbRow<Borrowed> = (row) => ({
  bookDataId: row.bookdataid,
  userId: row.userid,
  created: new Date(row.created),
  returned: row.returned,
  userBorrowedId: row.userborrowedid,
  nonUserName: row.nonusername,
  until: row.until && new Date(row.until),
  comment: row.comment,
});
