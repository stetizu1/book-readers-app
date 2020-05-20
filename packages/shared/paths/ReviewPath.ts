import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.review;

export const ReviewPath = {
  post: composePath(basePath),
  get: composePathWithParam(basePath),
  put: composePathWithParam(basePath),
  delete: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
};
