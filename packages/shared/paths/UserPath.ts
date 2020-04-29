import { BasePath, PathSpecification } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const UserPath = {
  post: composePath(BasePath.user),
  get: composePathWithParam(BasePath.user),
  put: composePathWithParam(BasePath.user),
  delete: composePathWithParam(BasePath.user),
  getAll: composePath(BasePath.user, true),
  getByEmail: composePathWithParam(BasePath.user, false, PathSpecification.email),
};
