import { QueryResultRow } from 'pg';

import { Book } from 'book-app-shared/types/Book';


export const createBookFromDbRow = (row: QueryResultRow): Book => ({
  id: row.id,
  name: row.name,
});
