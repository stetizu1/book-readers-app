import { QueryResultRow } from 'pg';

import { BookData } from 'book-app-shared/types/BookData';


export const createBookDataFromDbRow = (row: QueryResultRow): BookData => ({
  id: row.id,
  bookId: row.bookid,
  userId: row.userid,
  publisher: row.publisher,
  yearPublished: row.yearpublished,
  isbn: row.isbn,
  image: row.image,
  format: row.format,
  genreId: row.genreid,
});
