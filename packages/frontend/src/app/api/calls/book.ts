import { Book, BookCreate, BookWithAuthorIds } from 'book-app-shared/types/Book';
import { BookPath } from 'book-app-shared/paths/BookPath';

import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiGetAllAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiBook {
  post: ApiPostAuthorized<BookCreate, Book>;
  get: ApiGetAuthorized<BookWithAuthorIds>;
  getAll: ApiGetAllAuthorized<BookWithAuthorIds>;
}

export const apiBook: ApiBook = {
  post: apiAuthorized.post(BookPath.post),
  get: apiAuthorized.get(BookPath.get),
  getAll: apiAuthorized.getAll(BookPath.getAll),
};
