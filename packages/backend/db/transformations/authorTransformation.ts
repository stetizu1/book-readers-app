import { Author, WrittenBy } from 'book-app-shared/types/Author';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertDbRowToAuthor: ConvertDbRow<Author> = (row) => ({
  id: row.id,
  name: row.name,
});

export const convertDbRowToWrittenBy: ConvertDbRow<WrittenBy> = (row) => ({
  authorId: row.authorid,
  bookId: row.bookid,
});
