import { Genre } from 'book-app-shared/types/Genre';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertDbRowToGenre: ConvertDbRow<Genre> = (row) => ({
  id: row.id,
  name: row.name,
  language: row.language,
});
