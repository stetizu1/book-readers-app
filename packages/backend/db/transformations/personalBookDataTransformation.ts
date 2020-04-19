import { PersonalBookData, PersonalBookDataUpdate } from 'book-app-shared/types/PersonalBookData';

import { CreateFromDbRow, TransformToUpdate } from '../../types/db/TransformationTypes';


export const createPersonalBookDataFromDbRow: CreateFromDbRow<PersonalBookData> = (row) => ({
  bookDataId: row.bookdataid,
  dateRead: row.dateread && new Date(row.dateread),
  comment: row.comment,
});

export const transformPersonalBookDataUpdateFromPersonalBookData: TransformToUpdate<PersonalBookData, PersonalBookDataUpdate> = (original) => ({
  dateRead: original.dateRead && original.dateRead.toISOString(),
  comment: original.comment,
});
