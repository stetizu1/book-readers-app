import { QueryResultRow } from 'pg';

import { Review } from 'book-app-shared/types/Review';


export const createReviewFromDbRow = (row: QueryResultRow): Review => ({
  bookDataId: row.bookdataid,
  stars: row.stars,
  comment: row.comment,
});
