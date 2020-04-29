import { Author } from 'book-app-shared/types/Author';
import { AuthorPath } from 'book-app-shared/paths/AuthorPath';

import { ApiGetAllAuthorized, ApiGetAuthorized } from '../../types/ApiTypes';
import { apiAuthorized } from '../apiCalls';


export const apiGetAuthor: ApiGetAuthorized<Author> = apiAuthorized.get(AuthorPath.get);

export const apiGetAllAuthors: ApiGetAllAuthorized<Author> = apiAuthorized.getAll(AuthorPath.getAll);
