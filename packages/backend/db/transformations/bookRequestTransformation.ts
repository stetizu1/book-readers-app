import { BookRequest, BookRequestUpdate } from 'book-app-shared/types/BookRequest';

import { CreateFromDbRow, TransformToUpdate } from '../../types/db/TransformationTypes';


export const createBookRequestFromDbRow: CreateFromDbRow<BookRequest> = (row) => ({
  userId: row.userid,
  bookDataId: row.bookdataid,
  userBookingId: row.userbookingid,
  createdByBookingUser: row.createdbybookinguser,
  comment: row.comment,
});

export const transformBookRequestUpdateFromBookRequest: TransformToUpdate<BookRequest, BookRequestUpdate> = (original) => ({
  userBookingId: original.userBookingId,
  comment: original.comment,
});
