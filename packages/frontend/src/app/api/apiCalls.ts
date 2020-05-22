import { PathCreator, PathCreatorWithParam, PathCreatorWithTwoParams } from 'book-app-shared/helpers/composePath';

import {
  ApiPost,
  ApiGet, ApiGetAll,
  ApiPut,
  ApiDelete, ApiDeleteOnTwoParams,
} from 'app/types/ApiTypes';

import { api } from './apiClient';


interface ApiCall {
  post: <TCreateData, TData>
  (path: PathCreator) => ApiPost<TCreateData, TData>;

  get: <TData>
  (path: PathCreatorWithParam) => ApiGet<TData>;

  getAll: <TData>
  (path: PathCreator) => ApiGetAll<TData>;

  put: <TUpdateData, TData>
  (path: PathCreatorWithParam) => ApiPut<TUpdateData, TData>;

  delete: <TData>
  (path: PathCreatorWithParam) => ApiDelete<TData>;

  deleteOnTwoParams: <TData>
  (path: PathCreatorWithTwoParams) => ApiDeleteOnTwoParams<TData>;
}

// return type not necessary in returned function, since it is defined by return type of root function
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const apiCall: ApiCall = {
  post: (path) => (
    (data) => api.post(path(), data)
  ),

  get: (path) => (
    (param) => api.get(path(param))
  ),

  getAll: (path) => (
    () => api.get(path())
  ),

  put: (path) => (
    (param, data) => api.put(path(param), data)
  ),

  delete: (path) => (
    (param) => api.delete(path(param))
  ),

  deleteOnTwoParams: (path) => (
    (param, secondParam) => api.delete(path(param, secondParam))
  ),
};
/* eslint-enable @typescript-eslint/explicit-function-return-type */
