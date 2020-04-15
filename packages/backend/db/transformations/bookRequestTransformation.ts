import { BookRequest } from 'book-app-shared/types/BookRequest';

import { CreateFromDbRow } from '../createFromDbRow';


export const createBookRequestFromDbRow: CreateFromDbRow<BookRequest> = (row) => ({
  userId: row.userid,
  bookDataId: row.bookdataid,
  userBookingId: row.userbookingid,
  createdByBookingUser: row.createdByBookingUser,
  comment: row.comment,
});
