import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';
import { WrittenBy } from 'book-app-shared/types/Author';

import { ConvertDbRow, ConvertToComposed } from '../../types/db/TransformationTypes';


export const convertDbRowToBook: ConvertDbRow<Book> = (row) => ({
  id: row.id,
  name: row.name,
});

export const convertToBookWithAuthorIds: ConvertToComposed<Book, WrittenBy[], BookWithAuthorIds> = (book, writtenByArray) => ({
  ...book,
  authorIds: writtenByArray.map((writtenBy) => writtenBy.authorId),
});
