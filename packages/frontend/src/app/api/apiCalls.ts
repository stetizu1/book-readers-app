import { AxiosRequestConfig } from 'axios';

import { PathCreator, PathCreatorWithParam, PathCreatorWithTwoParams } from 'book-app-shared/helpers/composePath';

import { api } from './apiClient';
import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiGetAllAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized,
  ApiDeleteOnTwoParamsAuthorized,
} from '../types/ApiTypes';


const createHeaderConfig = (token: string): AxiosRequestConfig => ({
  headers: { Authorization: token },
});

interface ApiAuthorized {
  post: <TCreateData extends object, TData extends object>
  (path: PathCreator) => ApiPostAuthorized<TCreateData, TData>;

  get: <TData extends object>
  (path: PathCreatorWithParam) => ApiGetAuthorized<TData>;

  getAll: <TData extends object>
  (path: PathCreator) => ApiGetAllAuthorized<TData>;

  put: <TUpdateData extends object, TData extends object>
  (path: PathCreatorWithParam) => ApiPutAuthorized<TUpdateData, TData>;

  delete: <TData extends object>
  (path: PathCreatorWithParam) => ApiDeleteAuthorized<TData>;

  deleteOnTwoParams: <TData extends object>
  (path: PathCreatorWithTwoParams) => ApiDeleteOnTwoParamsAuthorized<TData>;
}

// return type not necessary in returned function, since it is defined by return type of root function
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const apiAuthorized: ApiAuthorized = {
  post: (path) => (
    (data, authToken) => api.post(path(), data, createHeaderConfig(authToken))
  ),

  get: (path) => (
    (param, authToken) => api.get(path(param), createHeaderConfig(authToken))
  ),

  getAll: (path) => (
    (authToken) => api.get(path(), createHeaderConfig(authToken))
  ),

  put: (path) => (
    (param, data, authToken) => api.put(path(param), data, createHeaderConfig(authToken))
  ),

  delete: (path) => (
    (param, authToken) => api.delete(path(param), createHeaderConfig(authToken))
  ),

  deleteOnTwoParams: (path) => (
    (param, secondParam, authToken) => api.delete(path(param, secondParam), createHeaderConfig(authToken))
  ),
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */
