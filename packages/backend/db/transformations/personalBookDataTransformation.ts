import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { CreateFromDbRow } from '../../types/db/TransformationTypes';


export const createPersonalBookDataFromDbRow: CreateFromDbRow<PersonalBookData> = (row) => ({
  bookDataId: row.bookdataid,
  dateRead: row.dateread && new Date(row.dateread),
  comment: row.comment,
});
