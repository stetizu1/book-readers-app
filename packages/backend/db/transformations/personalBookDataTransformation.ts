import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertDbRowToPersonalBookData: ConvertDbRow<PersonalBookData> = (row) => ({
  bookDataId: row.bookdataid || null,
  dateRead: row.dateread || null,
  comment: row.comment || null,
});
