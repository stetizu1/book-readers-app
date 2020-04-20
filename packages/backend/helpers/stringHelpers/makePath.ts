import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { Path } from '../../constants/Path';
import { PathOptions } from '../../constants/PathOptions';


type WrapPath = (path: Path) => string;

interface MakePath {
  get: WrapPath;
  getAll: WrapPath;
  post: WrapPath;
  put: WrapPath;
  delete: WrapPath;
}

const composePath = (path: Path, postfix?: PathOptions): string => (
  isUndefined(postfix)
    ? `${PathOptions.prefix}${path}`
    : `${PathOptions.prefix}${path}${postfix}`
);

/**
 * Constructs api path for required express call with adequate parameters.
 */
export const makePath: MakePath = {
  get: (path) => composePath(path, PathOptions.id),
  getAll: (path) => composePath(path, PathOptions.getAll),
  post: (path) => composePath(path),
  put: (path) => composePath(path, PathOptions.id),
  delete: (path) => composePath(path, PathOptions.id),
};
