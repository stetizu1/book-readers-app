import { Genre } from 'book-app-shared/types/Genre';
import { GenrePath } from 'book-app-shared/paths/GenrePath';


import {
  ApiGetAuthorized,
  ApiGetAllAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiGenre {
  get: ApiGetAuthorized<Genre>;
  getAll: ApiGetAllAuthorized<Genre>;
}

export const apiGenre: ApiGenre = {
  get: apiAuthorized.get(GenrePath.get),
  getAll: apiAuthorized.getAll(GenrePath.getAll),
};
