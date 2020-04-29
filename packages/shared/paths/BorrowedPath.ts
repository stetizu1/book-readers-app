import { BasePath, PathSpecification } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const BorrowedPath = {
  post: composePath(BasePath.borrowed),
  get: composePathWithParam(BasePath.borrowed),
  put: composePathWithParam(BasePath.borrowed),
  delete: composePathWithParam(BasePath.borrowed),
  getAll: composePath(BasePath.borrowed, true),
  getAllToUser: composePath(BasePath.borrowed, true, PathSpecification.toUser),
};
