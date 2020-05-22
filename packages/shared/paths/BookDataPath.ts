import { BasePath, PathSpecification } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.bookData;

export const BookDataPath = {
  post: composePath(basePath),
  get: composePathWithParam(basePath),
  put: composePathWithParam(basePath),
  delete: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
  getAllFriendsBookData: composePath(basePath, true, PathSpecification.friendsData),
};
