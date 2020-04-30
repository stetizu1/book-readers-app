import { BookRequest, BookRequestCreate, BookRequestUpdate } from 'book-app-shared/types/BookRequest';
import { BookRequestPath } from 'book-app-shared/paths/BookRequestPath';

import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized,
  ApiGetAllAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiBookRequest {
  post: ApiPostAuthorized<BookRequestCreate, BookRequest>;
  get: ApiGetAuthorized<BookRequest>;
  put: ApiPutAuthorized<BookRequestUpdate, BookRequest>;
  delete: ApiDeleteAuthorized<BookRequest>;
  getAll: ApiGetAllAuthorized<BookRequest>;
}

export const apiBookRequest: ApiBookRequest = {
  post: apiAuthorized.post(BookRequestPath.post),
  get: apiAuthorized.get(BookRequestPath.get),
  put: apiAuthorized.put(BookRequestPath.put),
  delete: apiAuthorized.delete(BookRequestPath.delete),
  getAll: apiAuthorized.getAll(BookRequestPath.getAll),
};
