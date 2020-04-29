import { AxiosResponse } from 'axios';

export type ApiResponse<TData> = Promise<AxiosResponse<TData>>;
