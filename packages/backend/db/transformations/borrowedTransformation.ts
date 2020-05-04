import { Borrowed } from 'book-app-shared/types/Borrowed';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertDbRowToBorrowed: ConvertDbRow<Borrowed> = (row) => ({
  id: row.id,
  bookDataId: row.bookdataid,
  created: new Date(row.created),
  returned: row.returned,
  userBorrowedId: row.userborrowedid,
  nonUserName: row.nonusername,
  until: row.until && new Date(row.until),
  comment: row.comment,
});
