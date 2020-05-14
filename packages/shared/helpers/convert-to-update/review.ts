import { Review, ReviewUpdate } from '../../types/Review';
import { ConvertToUpdate } from '../../types/others/ConvertToUpdate';
import { isNull } from '../typeChecks';

export const convertReviewToReviewUpdate: ConvertToUpdate<Review | null, ReviewUpdate> = (original) => ({
  stars: !isNull(original) ? original.stars : null,
  comment: !isNull(original) ? original.comment : null,
});
