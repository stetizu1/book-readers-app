import { PersonalBookData, PersonalBookDataUpdate } from 'book-app-shared/types/PersonalBookData';

import { ConvertDbRow, ConvertToUpdate } from '../../types/db/TransformationTypes';


export const convertPersonalBookDataFromDbRow: ConvertDbRow<PersonalBookData> = (row) => ({
  bookDataId: row.bookdataid || null,
  dateRead: (row.dateread && new Date(row.dateread)) || null,
  comment: row.comment || null,
});

export const convertPersonalBookDataToPersonalBookDataUpdate: ConvertToUpdate<PersonalBookData, PersonalBookDataUpdate> = (original) => ({
  dateRead: original.dateRead && original.dateRead.toISOString(),
  comment: original.comment,
});
