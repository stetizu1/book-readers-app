import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const LabelPath = {
  post: composePath(BasePath.label),
  get: composePathWithParam(BasePath.label),
  put: composePathWithParam(BasePath.label),
  delete: composePathWithParam(BasePath.label),
  getAll: composePath(BasePath.label, true),
};
