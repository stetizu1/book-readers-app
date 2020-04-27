import { Review, ReviewUpdate } from 'book-app-shared/types/Review';

import { ConvertDbRow, ConvertToUpdate } from '../../types/db/TransformationTypes';


export const convertDbRowToReview: ConvertDbRow<Review> = (row) => ({
  bookDataId: row.bookdataid || null,
  stars: row.stars || null,
  comment: row.comment || null,
});

export const convertReviewToReviewUpdate: ConvertToUpdate<Review, ReviewUpdate> = (original) => ({
  stars: original.stars,
  comment: original.comment,
});
