import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const ReviewPath = {
  post: composePath(BasePath.review),
  get: composePathWithParam(BasePath.review),
  put: composePathWithParam(BasePath.review),
  delete: composePathWithParam(BasePath.review),
  getAll: composePath(BasePath.review, true),
};
