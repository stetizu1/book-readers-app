import { Review, ReviewUpdate } from 'book-app-shared/types/Review';

import { CreateFromDbRow, TransformToUpdate } from '../../types/db/TransformationTypes';


export const createReviewFromDbRow: CreateFromDbRow<Review> = (row) => ({
  bookDataId: row.bookdataid || null,
  stars: row.stars || null,
  comment: row.comment || null,
});

export const transformReviewUpdateFromReview: TransformToUpdate<Review, ReviewUpdate> = (original) => ({
  stars: original.stars,
  comment: original.comment,
});
