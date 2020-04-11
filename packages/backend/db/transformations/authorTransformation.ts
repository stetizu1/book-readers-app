import { QueryResultRow } from 'pg';

import { Author } from 'book-app-shared/types/Author';


export const createAuthorFromDbRow = (row: QueryResultRow): Author => ({
  id: row.id,
  name: row.name,
});
