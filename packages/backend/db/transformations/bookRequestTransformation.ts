import { BookRequest, BookRequestWithBookData } from 'book-app-shared/types/BookRequest';
import { BookData } from 'book-app-shared/types/BookData';

import { ConvertDbRow, ConvertToComposed } from '../../types/db/TransformationTypes';


export const convertDbRowToBookRequest: ConvertDbRow<BookRequest> = (row) => ({
  userId: row.userid,
  bookDataId: row.bookdataid,
  userBookingId: row.userbookingid,
  createdByBookingUser: row.createdbybookinguser,
  comment: row.comment,
});

export const convertToBookRequestWithBookData: ConvertToComposed<BookRequest, BookData, BookRequestWithBookData> = (bookRequest, bookData) => ({
  ...bookRequest,
  bookData,
});
