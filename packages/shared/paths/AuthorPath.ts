import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const AuthorPath = {
  get: composePathWithParam(BasePath.author),
  getAll: composePath(BasePath.author, true),
};
