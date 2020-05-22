import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.genre;

export const GenrePath = {
  get: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
};
