import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.friendship;

export const FriendshipPath = {
  post: composePath(basePath),
  get: composePathWithParam(basePath),
  put: composePathWithParam(basePath),
  delete: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
};
