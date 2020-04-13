import { QueryResultRow } from 'pg';

import { Genre } from 'book-app-shared/types/Genre';


export const createGenreFromDbRow = (row: QueryResultRow): Genre => ({
  id: row.id,
  name: row.name,
});
