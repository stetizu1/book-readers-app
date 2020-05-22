import { BasePath, PathSpecification } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.user;

export const UserPath = {
  post: composePath(basePath),
  get: composePathWithParam(basePath),
  put: composePathWithParam(basePath),
  delete: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
  getByEmail: composePathWithParam(basePath, false, PathSpecification.email),
};
