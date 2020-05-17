import { BasePath, PathSpecification } from '../constants/Path';
import { composePath, composePathWithParam } from '../helpers/composePath';


export const BookRequestPath = {
  post: composePath(BasePath.bookRequest),
  get: composePathWithParam(BasePath.bookRequest),
  put: composePathWithParam(BasePath.bookRequest),
  delete: composePathWithParam(BasePath.bookRequest),
  getAll: composePath(BasePath.bookRequest, true),
  getAllBooked: composePath(BasePath.bookRequest, true, PathSpecification.booked),
};
