import { Review, ReviewCreate, ReviewUpdate } from 'book-app-shared/types/Review';
import { ReviewPath } from 'book-app-shared/paths/ReviewPath';

import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized,
  ApiGetAllAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiReview {
  post: ApiPostAuthorized<ReviewCreate, Review>;
  get: ApiGetAuthorized<Review>;
  put: ApiPutAuthorized<ReviewUpdate, Review>;
  delete: ApiDeleteAuthorized<Review>;
  getAll: ApiGetAllAuthorized<Review>;
}

export const apiReview: ApiReview = {
  post: apiAuthorized.post(ReviewPath.post),
  get: apiAuthorized.get(ReviewPath.get),
  put: apiAuthorized.put(ReviewPath.put),
  delete: apiAuthorized.delete(ReviewPath.delete),
  getAll: apiAuthorized.getAll(ReviewPath.getAll),
};
