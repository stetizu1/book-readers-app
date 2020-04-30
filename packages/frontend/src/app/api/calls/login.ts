import { LoginPath } from 'book-app-shared/paths/LoginPath';

import {
  ApiGetUnauthorized,
} from '../../types/ApiTypes';

import { apiUnauthorized } from '../apiCalls';


interface ApiLogin {
  get: ApiGetUnauthorized<string>;
}

export const apiLogin: ApiLogin = {
  get: apiUnauthorized.get(LoginPath.get),
};
