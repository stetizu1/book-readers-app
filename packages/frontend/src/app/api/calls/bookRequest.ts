import {
  BookRequest,
  BookRequestCreate,
  BookRequestUpdate,
  BookRequestWithBookData,
} from 'book-app-shared/types/BookRequest';
import { BookRequestPath } from 'book-app-shared/paths/BookRequestPath';

import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiDelete,
  ApiGetAll,
} from 'app/types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiBookRequest {
  post: ApiPost<BookRequestCreate, BookRequest>;
  get: ApiGet<BookRequest>;
  put: ApiPut<BookRequestUpdate, BookRequest>;
  delete: ApiDelete<BookRequest>;
  getAll: ApiGetAll<BookRequestWithBookData>;
  getAllBooked: ApiGetAll<BookRequestWithBookData>;
  getAllFriendsBookRequest: ApiGetAll<BookRequestWithBookData>;
}

export const apiBookRequest: ApiBookRequest = {
  post: apiCall.post(BookRequestPath.post),
  get: apiCall.get(BookRequestPath.get),
  put: apiCall.put(BookRequestPath.put),
  delete: apiCall.delete(BookRequestPath.delete),
  getAll: apiCall.getAll(BookRequestPath.getAll),
  getAllBooked: apiCall.getAll(BookRequestPath.getAllBooked),
  getAllFriendsBookRequest: apiCall.getAll(BookRequestPath.getAllFriendsRequests),
};
