import { Borrowed, BorrowedCreate, BorrowedUpdate } from 'book-app-shared/types/Borrowed';
import { BorrowedPath } from 'book-app-shared/paths/BorrowedPath';

import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized,
  ApiGetAllAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiBorrowed {
  post: ApiPostAuthorized<BorrowedCreate, Borrowed>;
  get: ApiGetAuthorized<Borrowed>;
  put: ApiPutAuthorized<BorrowedUpdate, Borrowed>;
  delete: ApiDeleteAuthorized<Borrowed>;
  getAll: ApiGetAllAuthorized<Borrowed>;
  getAllToUser: ApiGetAllAuthorized<Borrowed>;
}

export const apiBorrowed: ApiBorrowed = {
  post: apiAuthorized.post(BorrowedPath.post),
  get: apiAuthorized.get(BorrowedPath.get),
  put: apiAuthorized.put(BorrowedPath.put),
  delete: apiAuthorized.delete(BorrowedPath.delete),
  getAll: apiAuthorized.getAll(BorrowedPath.getAll),
  getAllToUser: apiAuthorized.getAll(BorrowedPath.getAllToUser),
};
