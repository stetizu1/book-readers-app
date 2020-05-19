import { BasePath, PathSpecification } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const BookDataPath = {
  post: composePath(BasePath.bookData),
  get: composePathWithParam(BasePath.bookData),
  put: composePathWithParam(BasePath.bookData),
  delete: composePathWithParam(BasePath.bookData),
  getAll: composePath(BasePath.bookData, true),
  getAllFriendsBookData: composePath(BasePath.bookData, true, PathSpecification.withFriends),
};
