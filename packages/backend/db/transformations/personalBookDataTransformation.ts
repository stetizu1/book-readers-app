import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertPersonalBookDataFromDbRow: ConvertDbRow<PersonalBookData> = (row) => ({
  bookDataId: row.bookdataid || null,
  dateRead: (row.dateread && new Date(row.dateread)) || null,
  comment: row.comment || null,
});
