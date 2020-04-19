import { Borrowed, BorrowedUpdate } from 'book-app-shared/types/Borrowed';

import { CreateFromDbRow, TransformToUpdate } from '../../types/db/TransformationTypes';


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

export const transformBorrowedUpdateFromBorrowed: TransformToUpdate<Borrowed, BorrowedUpdate> = (original) => ({
  returned: original.returned,
  userBorrowedId: original.userBorrowedId,
  nonUserName: original.nonUserName,
  until: original.until && original.until.toISOString(),
  comment: original.comment,
});
