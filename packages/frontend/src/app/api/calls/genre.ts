import { Genre } from 'book-app-shared/types/Genre';
import { GenrePath } from 'book-app-shared/paths/GenrePath';


import {
  ApiGet,
  ApiGetAll,
} from '../../types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiGenre {
  get: ApiGet<Genre>;
  getAll: ApiGetAll<Genre>;
}

export const apiGenre: ApiGenre = {
  get: apiCall.get(GenrePath.get),
  getAll: apiCall.getAll(GenrePath.getAll),
};
