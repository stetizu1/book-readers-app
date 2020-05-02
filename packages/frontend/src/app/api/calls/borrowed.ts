import { Borrowed, BorrowedCreate, BorrowedUpdate } from 'book-app-shared/types/Borrowed';
import { BorrowedPath } from 'book-app-shared/paths/BorrowedPath';

import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiDelete,
  ApiGetAll,
} from '../../types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiBorrowed {
  post: ApiPost<BorrowedCreate, Borrowed>;
  get: ApiGet<Borrowed>;
  put: ApiPut<BorrowedUpdate, Borrowed>;
  delete: ApiDelete<Borrowed>;
  getAll: ApiGetAll<Borrowed>;
  getAllToUser: ApiGetAll<Borrowed>;
}

export const apiBorrowed: ApiBorrowed = {
  post: apiCall.post(BorrowedPath.post),
  get: apiCall.get(BorrowedPath.get),
  put: apiCall.put(BorrowedPath.put),
  delete: apiCall.delete(BorrowedPath.delete),
  getAll: apiCall.getAll(BorrowedPath.getAll),
  getAllToUser: apiCall.getAll(BorrowedPath.getAllToUser),
};
