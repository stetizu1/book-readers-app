import {
  User, UserCreate, UserUpdate, UserUpdateWithPassword,
} from 'book-app-shared/types/User';
import { UserPath } from 'book-app-shared/paths/UserPath';

import {
  ApiPostUnauthorized,
  ApiGetAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized,
  ApiGetAllAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized, apiUnauthorized } from '../apiCalls';


interface ApiUser {
  post: ApiPostUnauthorized<UserCreate, User>;
  get: ApiGetAuthorized<User>;
  getByEmail: ApiGetAuthorized<User>;
  put: ApiPutAuthorized<UserUpdate | UserUpdateWithPassword, User>;
  delete: ApiDeleteAuthorized<User>;
  getAll: ApiGetAllAuthorized<User>;
}

export const apiUser: ApiUser = {
  post: apiUnauthorized.post(UserPath.post),
  get: apiAuthorized.get(UserPath.get),
  getByEmail: apiAuthorized.get(UserPath.getByEmail),
  put: apiAuthorized.put(UserPath.put),
  delete: apiAuthorized.delete(UserPath.delete),
  getAll: apiAuthorized.getAll(UserPath.getAll),
};
