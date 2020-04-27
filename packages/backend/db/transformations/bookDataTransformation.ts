import { BookData, BookDataUpdate, BookDataWithLabelIds } from 'book-app-shared/types/BookData';
import { HasLabel } from 'book-app-shared/types/HasLabel';

import {
  ConvertToComposed,
  ConvertDbRow,
  ConvertToUpdate,
} from '../../types/db/TransformationTypes';


export const convertDbRowToBookData: ConvertDbRow<BookData> = (row) => ({
  id: row.id,
  bookId: row.bookid,
  userId: row.userid,
  publisher: row.publisher,
  yearPublished: row.yearpublished,
  isbn: row.isbn && row.isbn.trim(),
  image: row.image,
  format: row.format,
  genreId: row.genreid,
});

export const convertToBookDataWithLabelIds: ConvertToComposed<BookData, HasLabel, BookDataWithLabelIds> = (bookData, hasLabelArray) => ({
  ...bookData,
  labelsIds: hasLabelArray.map((hasLabel) => hasLabel.labelId),
});

export const convertBookDataToBookDataUpdate: ConvertToUpdate<BookDataWithLabelIds | BookData, BookDataUpdate> = (original) => ({
  userId: original.userId,
  publisher: original.publisher,
  yearPublished: original.yearPublished,
  isbn: original.isbn,
  image: original.image,
  format: original.format,
  genreId: original.genreId,
  labelsIds: 'labelsIds' in original ? original.labelsIds : [],
});
