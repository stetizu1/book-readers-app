import { Review } from 'book-app-shared/types/Review';

import { CreateFromDbRow } from '../../types/db/TransformationTypes';


export const createReviewFromDbRow: CreateFromDbRow<Review> = (row) => ({
  bookDataId: row.bookdataid,
  stars: row.stars,
  comment: row.comment,
});
