import { AxiosResponse } from 'axios';


type ApiResponse<TData> = Promise<AxiosResponse<TData>>;


export type ApiPost<TCreateData, TData> =
  (data: TCreateData) => ApiResponse<TData>;

export type ApiGet<TData> =
  (param: string | number) => ApiResponse<TData>;

export type ApiGetAll<TOutputData> =
  () => ApiResponse<TOutputData[]>;

export type ApiPut<TUpdateData, TData> =
  (param: string | number, data: TUpdateData) => ApiResponse<TData>;

export type ApiDelete<TData> =
  (param: string | number) => ApiResponse<TData>;

export type ApiDeleteOnTwoParams<TData> =
  (param: string | number, secondParam: string | number) => ApiResponse<TData>;
