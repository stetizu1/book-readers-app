import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const PersonalBookDataPath = {
  post: composePath(BasePath.personalBookData),
  get: composePathWithParam(BasePath.personalBookData),
  put: composePathWithParam(BasePath.personalBookData),
  delete: composePathWithParam(BasePath.personalBookData),
};
