import {
  BookData, BookDataCreate, BookDataUpdate, BookDataWithLabelIds,
} from 'book-app-shared/types/BookData';
import { BookDataPath } from 'book-app-shared/paths/BookDataPath';

import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiDelete,
  ApiGetAll,
} from 'app/types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiBookData {
  post: ApiPost<BookDataCreate, BookData>;
  get: ApiGet<BookData | BookDataWithLabelIds>;
  put: ApiPut<BookDataUpdate, BookData>;
  delete: ApiDelete<BookData>;
  getAll: ApiGetAll<BookDataWithLabelIds>;
}

export const apiBookData: ApiBookData = {
  post: apiCall.post(BookDataPath.post),
  get: apiCall.get(BookDataPath.get),
  put: apiCall.put(BookDataPath.put),
  delete: apiCall.delete(BookDataPath.delete),
  getAll: apiCall.getAll(BookDataPath.getAll),
};
