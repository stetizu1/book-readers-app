import { QueryResultRow } from 'pg';

import { Borrowed } from 'book-app-shared/types/Borrowed';


export const createBorrowedFromDbRow = (row: QueryResultRow): Borrowed => ({
  bookId: row.bookid,
  userId: row.userid,
  created: new Date(row.created),
  returned: row.returned,
  userBorrowedId: row.userborrowedid,
  nonUserName: row.nonusername,
  until: new Date(row.until),
  comment: row.comment,
});
