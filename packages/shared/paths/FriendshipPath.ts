import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const FriendshipPath = {
  post: composePath(BasePath.friendship),
  get: composePathWithParam(BasePath.friendship),
  put: composePathWithParam(BasePath.friendship),
  delete: composePathWithParam(BasePath.friendship),
  getAll: composePath(BasePath.friendship, true),
};
