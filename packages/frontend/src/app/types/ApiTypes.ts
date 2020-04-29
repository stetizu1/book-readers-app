import { AxiosResponse } from 'axios';

type ApiResponse<TData> = Promise<AxiosResponse<TData>>;


export type ApiReadUnauthorized<TData extends object> =
  (param: string | number) => ApiResponse<TData>;

export type ApiCreateUnauthorized<TCreateData extends object, TData extends object> =
  (data: TCreateData) => ApiResponse<TData>;


export type ApiPostAuthorized<TCreateData extends object, TData extends object> =
  (data: TCreateData, authToken: string) => ApiResponse<TData>;

export type ApiGetAuthorized<TData extends object> =
  (param: string | number, authToken: string) => ApiResponse<TData>;

export type ApiGetAllAuthorized<TOutputData extends object> =
  (authToken: string) => ApiResponse<TOutputData[]>;

export type ApiPutAuthorized<TUpdateData extends object, TData extends object> =
  (param: string | number, data: TUpdateData, authToken: string) => ApiResponse<TData>;

export type ApiDeleteAuthorized<TData extends object> =
  (param: string | number, authToken: string) => ApiResponse<TData>;

export type ApiDeleteOnTwoParamsAuthorized<TData extends object> =
  (param: string | number, secondParam: string | number, authToken: string) => ApiResponse<TData>;
