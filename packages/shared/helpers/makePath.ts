import {
  Path, PathSpecification, PathPrefix, PathPostfix,
} from '../constants/Path';
import { isUndefined } from './typeChecks';


type WrapPath = (path: Path, pathSpec?: PathSpecification[]) => string;
type WrapPathFillable = (path: Path, parameter: string, pathSpec?: PathSpecification[]) => string;

interface ConstructPath {
  post: WrapPath;
  getAll: WrapPath;
  deleteWithBody: WrapPath;
  get: WrapPathFillable;
  put: WrapPathFillable;
  delete: WrapPathFillable;
}

const composePath = (path: Path, pathSpec?: PathSpecification[], postfix?: PathPostfix | string): string => {
  const specs = !isUndefined(pathSpec) ? `/${pathSpec.join('/')}` : '';
  const post = !isUndefined(postfix) ? postfix : '';
  return `${PathPrefix.prefix}${path}${post}${specs}`;
};

/**
 * Constructs api path for express call with given parameter if needed.
 */
export const constructPath: ConstructPath = {
  post:
    (path, pathSpec) => composePath(path, pathSpec),
  getAll:
    (path, pathSpec) => composePath(path, pathSpec, PathPostfix.getAll),
  deleteWithBody:
    (path, pathSpec) => composePath(path, pathSpec),
  get:
    (path, param, pathSpec) => composePath(path, pathSpec, param),
  put:
    (path, param, pathSpec) => composePath(path, pathSpec, param),
  delete:
    (path, param, pathSpec) => composePath(path, pathSpec, param),
};
