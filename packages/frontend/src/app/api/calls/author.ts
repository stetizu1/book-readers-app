import { Author } from 'book-app-shared/types/Author';
import { AuthorPath } from 'book-app-shared/paths/AuthorPath';

import { ApiGetAll, ApiGet } from 'app/types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiAuthor {
  get: ApiGet<Author>;
  getAll: ApiGetAll<Author>;
}

export const apiAuthor: ApiAuthor = {
  get: apiCall.get(AuthorPath.get),
  getAll: apiCall.getAll(AuthorPath.getAll),
};
