import { Application, Handler } from 'express';

import { makePath, Path } from '../../constants/paths';


type ExpressRequest = (app: Application, path: Path, handler: Handler) => void;

export interface Requests {
  post: ExpressRequest;
  get: ExpressRequest;
  getAll: ExpressRequest;
  put: ExpressRequest;
  delete: ExpressRequest;
}

export const requests: Requests = {
  post: (app, path, handler) => {
    app.post(
      makePath.post(path),
      handler,
    );
  },

  get: (app, path, handler) => {
    app.get(
      makePath.get(path),
      handler,
    );
  },

  getAll: (app, path, handler) => {
    app.get(
      makePath.getAll(path),
      handler,
    );
  },

  put: (app, path, handler) => {
    app.put(
      makePath.put(path),
      handler,
    );
  },

  delete: (app, path, handler) => {
    app.get(
      makePath.post(path),
      handler,
    );
  },
};
