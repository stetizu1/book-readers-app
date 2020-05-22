import { BasePath, PathSpecification } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


const basePath = BasePath.bookRequest;

export const BookRequestPath = {
  post: composePath(basePath),
  get: composePathWithParam(basePath),
  put: composePathWithParam(basePath),
  delete: composePathWithParam(basePath),
  getAll: composePath(basePath, true),
  getAllBooked: composePath(basePath, true, PathSpecification.booked),
  getAllFriendsRequests: composePath(basePath, true, PathSpecification.friendsData),
};
