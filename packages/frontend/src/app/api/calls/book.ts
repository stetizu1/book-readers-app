import { Book, BookCreate, BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookPath } from 'book-app-shared/paths/BookPath';

import {
  ApiPost,
  ApiGet,
  ApiGetAll,
} from '../../types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiBook {
  post: ApiPost<BookCreate, Book>;
  get: ApiGet<BookWithAuthorIds>;
  getAll: ApiGetAll<BookWithAuthorIds>;
}

export const apiBook: ApiBook = {
  post: apiCall.post(BookPath.post),
  get: apiCall.get(BookPath.get),
  getAll: apiCall.getAll(BookPath.getAll),
};
