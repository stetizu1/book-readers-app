import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';

import { CreateFromDbRow, CreateFromRowWithRows } from '../../types/db/TransformationTypes';


export const createBookFromDbRow: CreateFromDbRow<Book> = (row) => ({
  id: row.id,
  name: row.name,
});

export const createBookWithAuthorsIdsFromDbRows: CreateFromRowWithRows<BookWithAuthorIds> = (row, writtenByRows) => ({
  ...createBookFromDbRow(row),
  authorIds: writtenByRows.map((r) => r.authorid),
});
