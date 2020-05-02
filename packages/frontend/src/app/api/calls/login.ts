import { LoginPath } from 'book-app-shared/paths/LoginPath';

import { ApiGet } from '../../types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiLogin {
  get: ApiGet<string>;
}

export const apiLogin: ApiLogin = {
  get: apiCall.get(LoginPath.get),
};
