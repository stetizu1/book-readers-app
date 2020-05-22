import { BasePath } from '../constants/Path';
import { composePath, composePathWithParam, composePathWithTwoParams } from '../helpers/composePath';


const basePath = BasePath.hasLabel;

export const HasLabelPath = {
  post: composePath(basePath),
  get: composePathWithParam(basePath),
  delete: composePathWithTwoParams(basePath),
};
