import { AxiosRequestConfig } from 'axios';

import { PathCreator, PathCreatorWithParam, PathCreatorWithTwoParams } from 'book-app-shared/helpers/composePath';

import { api } from './apiClient';
import {
  ApiGetUnauthorized, ApiPostUnauthorized,
  ApiPostAuthorized,
  ApiGetAuthorized, ApiGetAllAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized, ApiDeleteOnTwoParamsAuthorized,
} from '../types/ApiTypes';


const createHeaderConfig = (token: string): AxiosRequestConfig => ({
  headers: { Authorization: token },
});

interface ApiUnauthorized {
  post: <TCreateData, TData>
  (path: PathCreator) => ApiPostUnauthorized<TCreateData, TData>;

  get: <TData>
  (path: PathCreatorWithParam) => ApiGetUnauthorized<TData>;
}

interface ApiAuthorized {
  post: <TCreateData, TData>
  (path: PathCreator) => ApiPostAuthorized<TCreateData, TData>;

  get: <TData>
  (path: PathCreatorWithParam) => ApiGetAuthorized<TData>;

  getAll: <TData>
  (path: PathCreator) => ApiGetAllAuthorized<TData>;

  put: <TUpdateData, TData>
  (path: PathCreatorWithParam) => ApiPutAuthorized<TUpdateData, TData>;

  delete: <TData>
  (path: PathCreatorWithParam) => ApiDeleteAuthorized<TData>;

  deleteOnTwoParams: <TData>
  (path: PathCreatorWithTwoParams) => ApiDeleteOnTwoParamsAuthorized<TData>;
}

// return type not necessary in returned function, since it is defined by return type of root function
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const apiUnauthorized: ApiUnauthorized = {
  post: (path) => (
    (data) => api.post(path(), data)
  ),
  get: (path) => (
    (param) => api.get(path(param))
  ),
};

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
