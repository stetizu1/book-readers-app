import { Review } from 'book-app-shared/types/Review';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertDbRowToReview: ConvertDbRow<Review> = (row) => ({
  bookDataId: row.bookdataid || null,
  stars: row.stars || null,
  comment: row.comment || null,
});
