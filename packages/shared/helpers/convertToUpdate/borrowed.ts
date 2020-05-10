import { Borrowed, BorrowedUpdate } from '../../types/Borrowed';
import { ConvertToUpdate } from '../../types/others/ConvertToUpdate';

export const convertBorrowedToBorrowedUpdate: ConvertToUpdate<Borrowed, BorrowedUpdate> = (original) => ({
  returned: original.returned,
  userBorrowedId: original.userBorrowedId,
  nonUserName: original.nonUserName,
  until: original.until,
  comment: original.comment,
});
