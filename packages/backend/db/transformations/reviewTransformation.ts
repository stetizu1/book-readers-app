import { Review } from 'book-app-shared/types/Review';

import { CreateFromDbRow } from '../createFromDbRow';


export const createReviewFromDbRow: CreateFromDbRow<Review> = (row) => ({
  bookDataId: row.bookdataid,
  stars: row.stars,
  comment: row.comment,
});
