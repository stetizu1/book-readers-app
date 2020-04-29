import { DefaultServerEnv } from 'book-app-shared/constants/env/DefaultServerEnv';

export enum DefaultClientEnv {
  timeout = 5000,
}

export const localBaseUrl = `${window.location.protocol}//${window.location.hostname}:${DefaultServerEnv.port}`;
