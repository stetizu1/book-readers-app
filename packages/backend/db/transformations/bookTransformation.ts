import { QueryResultRow } from 'pg';

import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';


export const createBookFromDbRow = (row: QueryResultRow): Book => ({
  id: row.id,
  name: row.name,
});

export const createBookWithAuthorsIdsFromDbRows = (row: QueryResultRow, writtenByRows: QueryResultRow[]): BookWithAuthorIds => ({
  ...createBookFromDbRow(row),
  authorIds: writtenByRows.map((r) => r.authorid),
});
