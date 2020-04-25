import { Book, BookWithAuthorIds } from 'book-app-shared/types/Book';
import { WrittenBy } from 'book-app-shared/types/Author';

import { CreateFromDbRow, ComposeObjectAndArrayTo } from '../../types/db/TransformationTypes';


export const createBookFromDbRow: CreateFromDbRow<Book> = (row) => ({
  id: row.id,
  name: row.name,
});

export const composeBookAndAuthors: ComposeObjectAndArrayTo<BookWithAuthorIds, Book, WrittenBy> = (book, writtenByArray) => ({
  ...book,
  authorIds: writtenByArray.map((writtenBy) => writtenBy.authorId),
});
