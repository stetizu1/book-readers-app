import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam, composePathWithTwoParams } from '../helpers/composePath';


export const HasLabelPath = {
  post: composePath(BasePath.hasLabel),
  get: composePathWithParam(BasePath.hasLabel),
  delete: composePathWithTwoParams(BasePath.hasLabel),
};
