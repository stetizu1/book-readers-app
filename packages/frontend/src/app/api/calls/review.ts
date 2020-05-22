import { Review, ReviewCreate, ReviewUpdate } from 'book-app-shared/types/Review';
import { ReviewPath } from 'book-app-shared/paths/ReviewPath';

import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiDelete,
  ApiGetAll,
} from 'app/types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiReview {
  post: ApiPost<ReviewCreate, Review>;
  get: ApiGet<Review | null>;
  put: ApiPut<ReviewUpdate, Review>;
  delete: ApiDelete<Review>;
  getAll: ApiGetAll<Review>;
}

export const apiReview: ApiReview = {
  post: apiCall.post(ReviewPath.post),
  get: apiCall.get(ReviewPath.get),
  put: apiCall.put(ReviewPath.put),
  delete: apiCall.delete(ReviewPath.delete),
  getAll: apiCall.getAll(ReviewPath.getAll),
};
