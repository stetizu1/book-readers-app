import { AxiosResponse } from 'axios';

type ApiResponse<TData> = Promise<AxiosResponse<TData>>;


export type ApiGetUnauthorized<TData> =
  (param: string | number) => ApiResponse<TData>;

export type ApiPostUnauthorized<TCreateData, TData> =
  (data: TCreateData) => ApiResponse<TData>;


export type ApiPostAuthorized<TCreateData, TData> =
  (data: TCreateData, authToken: string) => ApiResponse<TData>;

export type ApiGetAuthorized<TData> =
  (param: string | number, authToken: string) => ApiResponse<TData>;

export type ApiGetAllAuthorized<TOutputData> =
  (authToken: string) => ApiResponse<TOutputData[]>;

export type ApiPutAuthorized<TUpdateData, TData> =
  (param: string | number, data: TUpdateData, authToken: string) => ApiResponse<TData>;

export type ApiDeleteAuthorized<TData> =
  (param: string | number, authToken: string) => ApiResponse<TData>;

export type ApiDeleteOnTwoParamsAuthorized<TData> =
  (param: string | number, secondParam: string | number, authToken: string) => ApiResponse<TData>;
