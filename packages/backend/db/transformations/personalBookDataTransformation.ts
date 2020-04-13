import { QueryResultRow } from 'pg';

import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';


export const createPersonalBookDataFromDbRow = (row: QueryResultRow): PersonalBookData => ({
  bookDataId: row.bookdataid,
  dateRead: row.dateread,
  comment: row.comment,
});
