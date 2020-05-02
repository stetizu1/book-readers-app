import {
  User, UserCreate, UserUpdate, UserUpdateWithPassword,
} from 'book-app-shared/types/User';
import { UserPath } from 'book-app-shared/paths/UserPath';

import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiDelete,
  ApiGetAll,
} from '../../types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiUser {
  post: ApiPost<UserCreate, User>;
  get: ApiGet<User>;
  getByEmail: ApiGet<User>;
  put: ApiPut<UserUpdate | UserUpdateWithPassword, User>;
  delete: ApiDelete<User>;
  getAll: ApiGetAll<User>;
}

export const apiUser: ApiUser = {
  post: apiCall.post(UserPath.post),
  get: apiCall.get(UserPath.get),
  getByEmail: apiCall.get(UserPath.getByEmail),
  put: apiCall.put(UserPath.put),
  delete: apiCall.delete(UserPath.delete),
  getAll: apiCall.getAll(UserPath.getAll),
};
