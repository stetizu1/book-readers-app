import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.book;

export const BookPath = {
  post: composePath(basePath),
  get: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
};
