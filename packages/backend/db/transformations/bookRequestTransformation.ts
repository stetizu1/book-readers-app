import { BookRequest, BookRequestUpdate } from 'book-app-shared/types/BookRequest';

import { ConvertDbRow, ConvertToUpdate } from '../../types/db/TransformationTypes';


export const convertDbRowToBookRequest: ConvertDbRow<BookRequest> = (row) => ({
  userId: row.userid,
  bookDataId: row.bookdataid,
  userBookingId: row.userbookingid,
  createdByBookingUser: row.createdbybookinguser,
  comment: row.comment,
});

export const convertBookRequestToBookRequestUpdate: ConvertToUpdate<BookRequest, BookRequestUpdate> = (original) => ({
  userBookingId: original.userBookingId,
  comment: original.comment,
  createdByBookingUser: original.createdByBookingUser,
});
