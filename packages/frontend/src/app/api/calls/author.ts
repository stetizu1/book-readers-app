import { Author } from 'book-app-shared/types/Author';
import { AuthorPath } from 'book-app-shared/paths/AuthorPath';

import { ApiGetAllAuthorized, ApiGetAuthorized } from '../../types/ApiTypes';
import { apiAuthorized } from '../apiCalls';


interface ApiAuthor {
  get: ApiGetAuthorized<Author>;
  getAll: ApiGetAllAuthorized<Author>;
}

const apiAuthor: ApiAuthor = {
  get: apiAuthorized.get(AuthorPath.get),
  getAll: apiAuthorized.getAll(AuthorPath.getAll),
};
