import {
  BookData, BookDataCreate, BookDataUpdate, BookDataWithLabelIds,
} from 'book-app-shared/types/BookData';
import { BookDataPath } from 'book-app-shared/paths/BookDataPath';

import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized,
  ApiGetAllAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiBookData {
  post: ApiPostAuthorized<BookDataCreate, BookData>;
  get: ApiGetAuthorized<BookData | BookDataWithLabelIds>;
  put: ApiPutAuthorized<BookDataUpdate, BookData>;
  delete: ApiDeleteAuthorized<BookData>;
  getAll: ApiGetAllAuthorized<BookData>;
}

export const apiBookData: ApiBookData = {
  post: apiAuthorized.post(BookDataPath.post),
  get: apiAuthorized.get(BookDataPath.get),
  put: apiAuthorized.put(BookDataPath.put),
  delete: apiAuthorized.delete(BookDataPath.delete),
  getAll: apiAuthorized.getAll(BookDataPath.getAll),
};
