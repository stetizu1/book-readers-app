import { BasePath, PathSpecification } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.borrowed;

export const BorrowedPath = {
  post: composePath(basePath),
  get: composePathWithParam(basePath),
  put: composePathWithParam(basePath),
  delete: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
  getAllToUser: composePath(basePath, true, PathSpecification.toUser),
};
