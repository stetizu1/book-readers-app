import { BasePath } from '../constants/Path';
import { composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.login;

export const LoginPath = {
  get: composePathWithParam(basePath),
};
