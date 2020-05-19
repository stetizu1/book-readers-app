import { BookData, BookDataWithLabelIds, BookDataWithReview } from 'book-app-shared/types/BookData';
import { HasLabel } from 'book-app-shared/types/HasLabel';
import { Review } from 'book-app-shared/types/Review';

import { ConvertDbRow, ConvertToComposed } from '../../types/db/TransformationTypes';


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

export const convertToBookDataWithLabelIds: ConvertToComposed<BookData, HasLabel[], BookDataWithLabelIds> = (bookData, hasLabelArray) => ({
  ...bookData,
  labelsIds: hasLabelArray.map((hasLabel) => hasLabel.labelId),
});

export const convertToBookDataWithReview: ConvertToComposed<BookData, Review | null, BookDataWithReview> = (bookData, review) => ({
  ...bookData,
  review,
});
