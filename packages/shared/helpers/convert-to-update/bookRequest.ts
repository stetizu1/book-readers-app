import { BookRequest, BookRequestUpdate } from '../../types/BookRequest';
import { ConvertToUpdate } from '../../types/others/ConvertToUpdate';

export const convertBookRequestToBookRequestUpdate: ConvertToUpdate<BookRequest, BookRequestUpdate> = (original) => ({
  userBookingId: original.userBookingId,
  comment: original.comment,
  createdByBookingUser: original.createdByBookingUser,
});
