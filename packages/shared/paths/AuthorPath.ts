import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.author;

export const AuthorPath = {
  get: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
};
