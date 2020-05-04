import { BookRequest } from 'book-app-shared/types/BookRequest';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertDbRowToBookRequest: ConvertDbRow<BookRequest> = (row) => ({
  userId: row.userid,
  bookDataId: row.bookdataid,
  userBookingId: row.userbookingid,
  createdByBookingUser: row.createdbybookinguser,
  comment: row.comment,
});
