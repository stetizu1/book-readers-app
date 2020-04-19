import { BookData, BookDataUpdate, BookDataWithLabelIds } from 'book-app-shared/types/BookData';

import { CreateFromDbRow, CreateFromRowWithRows, TransformToUpdate } from '../../types/db/TransformationTypes';


export const createBookDataFromDbRow: CreateFromDbRow<BookData> = (row) => ({
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

export const createBookDataWithLabelsIdsFromDbRows: CreateFromRowWithRows<BookDataWithLabelIds> = (row, hasLabelRows) => ({
  ...createBookDataFromDbRow(row),
  labelsIds: hasLabelRows.map((r) => r.labelid),
});

export const transformBookDataUpdateFromBookData: TransformToUpdate<BookDataWithLabelIds, BookDataUpdate> = (original) => ({
  userId: original.userId,
  publisher: original.publisher,
  yearPublished: original.yearPublished,
  isbn: original.isbn,
  image: original.image,
  format: original.format,
  genreId: original.genreId,
  labelsIds: original.labelsIds,
});
