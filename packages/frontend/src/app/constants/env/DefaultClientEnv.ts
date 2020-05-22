import { DefaultServerEnv } from 'book-app-shared/constants/env/DefaultServerEnv';

export enum DefaultClientEnv {
  timeout = 5000,
  cookiePolicy = 'single_host_origin'
}

export const localBaseUrl = `${window.location.protocol}//${window.location.hostname}:${DefaultServerEnv.port}`;
