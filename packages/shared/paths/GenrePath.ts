import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const GenrePath = {
  get: composePathWithParam(BasePath.genre),
  getAll: composePath(BasePath.genre, true),
};
