import { Review, ReviewUpdate } from '../../types/Review';
import { ConvertToUpdate } from '../../types/others/ConvertToUpdate';

export const convertReviewToReviewUpdate: ConvertToUpdate<Review, ReviewUpdate> = (original) => ({
  stars: original.stars,
  comment: original.comment,
});
