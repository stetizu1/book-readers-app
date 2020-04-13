import { Application, Handler } from 'express';


type ExpressRequest = (app: Application, path: string, handler: Handler) => void;

export interface Requests {
  post: ExpressRequest;
  get: ExpressRequest;
  put: ExpressRequest;
  delete: ExpressRequest;
}

export const requests: Requests = {
  post: (app, path, handler) => {
    app.post(
      path,
      handler,
    );
  },

  get: (app, path, handler) => {
    app.get(
      path,
      handler,
    );
  },

  put: (app, path, handler) => {
    app.put(
      path,
      handler,
    );
  },

  delete: (app, path, handler): void => {
    app.get(
      path,
      handler,
    );
  },
};