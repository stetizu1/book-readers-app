import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { Path, PathSpecification } from '../../constants/Path';
import { PathOptions } from '../../constants/PathOptions';


type WrapPath = (path: Path, pathSpec: PathSpecification[]) => string;

interface MakePath {
  get: WrapPath;
  getAll: WrapPath;
  post: WrapPath;
  put: WrapPath;
  delete: WrapPath;
  deleteWithBody: WrapPath;
}

const composePath = (path: Path, pathSpec: PathSpecification[], postfix?: PathOptions): string => {
  const specs = pathSpec.join('/');
  return isUndefined(postfix)
    ? `${PathOptions.prefix}${path}/${specs}`
    : `${PathOptions.prefix}${path}${postfix}/${specs}`;
};

/**
 * Constructs api path for required express call with adequate parameters.
 */
export const makePath: MakePath = {
  get: (path, pathSpec) => composePath(path, pathSpec, PathOptions.param),
  getAll: (path, pathSpec) => composePath(path, pathSpec, PathOptions.getAll),
  post: (path, pathSpec) => composePath(path, pathSpec),
  put: (path, pathSpec) => composePath(path, pathSpec, PathOptions.param),
  delete: (path, pathSpec) => composePath(path, pathSpec, PathOptions.param),
  deleteWithBody: (path, pathSpec) => composePath(path, pathSpec),
};
