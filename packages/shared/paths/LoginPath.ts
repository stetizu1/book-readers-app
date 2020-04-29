import { BasePath } from '../constants/Path';
import { composePathWithParam } from '../helpers/composePath';


export const LoginPath = {
  get: composePathWithParam(BasePath.login),
};
