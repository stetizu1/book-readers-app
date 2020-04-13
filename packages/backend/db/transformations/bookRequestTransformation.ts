import { QueryResultRow } from 'pg';

import { BookRequest } from 'book-app-shared/types/BookRequest';


export const createBookRequestFromDbRow = (row: QueryResultRow): BookRequest => ({
  userId: row.userid,
  bookDataId: row.bookdataid,
  userBookingId: row.userbookingid,
  createdByBookingUser: row.createdByBookingUser,
  comment: row.comment,
});
