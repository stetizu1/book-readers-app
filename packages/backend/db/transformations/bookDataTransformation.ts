import { BookData } from 'book-app-shared/types/BookData';

import { CreateFromDbRow } from '../../types/db/TransformationTypes';


export const createBookDataFromDbRow: CreateFromDbRow<BookData> = (row) => ({
  id: row.id,
  bookId: row.bookid,
  userId: row.userid,
  publisher: row.publisher,
  yearPublished: row.yearpublished,
  isbn: row.isbn.trim(),
  image: row.image,
  format: row.format,
  genreId: row.genreid,
});
