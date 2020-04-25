import { Author, WrittenBy } from 'book-app-shared/types/Author';

import { CreateFromDbRow } from '../../types/db/TransformationTypes';


export const createAuthorFromDbRow: CreateFromDbRow<Author> = (row) => ({
  id: row.id,
  name: row.name,
});

export const createWrittenByFromDbRow: CreateFromDbRow<WrittenBy> = (row) => ({
  authorId: row.authorid,
  bookId: row.bookid,
});
