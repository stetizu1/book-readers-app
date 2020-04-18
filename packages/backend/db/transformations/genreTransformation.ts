import { Genre } from 'book-app-shared/types/Genre';

import { CreateFromDbRow } from '../../types/db/TransformationTypes';


export const createGenreFromDbRow: CreateFromDbRow<Genre> = (row) => ({
  id: row.id,
  name: row.name,
  language: row.language,
});
