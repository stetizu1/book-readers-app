import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const BookPath = {
  post: composePath(BasePath.book),
  get: composePathWithParam(BasePath.book),
  getAll: composePath(BasePath.book, true),
};
