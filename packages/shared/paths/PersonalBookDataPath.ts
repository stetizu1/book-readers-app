import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.personalBookData;

export const PersonalBookDataPath = {
  post: composePath(basePath),
  get: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
  put: composePathWithParam(basePath),
  delete: composePathWithParam(basePath),
};
