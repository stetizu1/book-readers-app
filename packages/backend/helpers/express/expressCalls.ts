import { Express } from 'express';

import {
  UnauthorizedCreateActionWithContext,
  UnauthorizedReadActionWithContext,
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
  DeleteOnTwoParamsActionWithContext,
} from '../../types/actionTypes';
import { wrapActionToHandler, wrapUnauthorizedActionToHandler } from './wrapActionToHandler';
import { authorizeHandler } from './authorizeHandler';


interface UnauthorizedRequests {
  post: <T>(app: Express, action: UnauthorizedCreateActionWithContext<T>, path: string) => void;
  get: <T>(app: Express, action: UnauthorizedReadActionWithContext<T>, path: string) => void;
}

interface Requests {
  post: <T>(app: Express, action: CreateActionWithContext<T>, path: string) => void;
  get: <T>(app: Express, action: ReadActionWithContext<T>, path: string) => void;
  getAll: <T>(app: Express, action: ReadAllActionWithContext<T>, path: string) => void;
  put: <T>(app: Express, action: UpdateActionWithContext<T>, path: string) => void;
  delete: <T>(app: Express, action: DeleteActionWithContext<T>, path: string) => void;
  deleteOnTwoParams: <T>(app: Express, action: DeleteOnTwoParamsActionWithContext<T>, path: string) => void;
}

/**
 * Wraps request path to required format and provides context to given action.
 */
export const unauthorizedRequests: UnauthorizedRequests = {
  post: (app, createActionWithContext, path) => {
    app.post(
      path,
      wrapUnauthorizedActionToHandler.create(createActionWithContext),
    );
  },

  get: (app, readActionWithContext, path) => {
    app.get(
      path,
      wrapUnauthorizedActionToHandler.read(readActionWithContext),
    );
  },
};

/**
 * Wraps request path to required format and provides context and userId to given action. Adds authorization.
 */
export const requests: Requests = {
  post: (app, createActionWithContext, path) => {
    app.post(
      path,
      authorizeHandler,
      wrapActionToHandler.create(createActionWithContext),
    );
  },

  get: (app, readActionWithContext, path) => {
    app.get(
      path,
      authorizeHandler,
      wrapActionToHandler.read(readActionWithContext),
    );
  },

  getAll: (app, readAllActionWithContext, path) => {
    app.get(
      path,
      authorizeHandler,
      wrapActionToHandler.readAll(readAllActionWithContext),
    );
  },

  put: (app, updateActionWithContext, path) => {
    app.put(
      path,
      authorizeHandler,
      wrapActionToHandler.update(updateActionWithContext),
    );
  },

  delete: (app, deleteActionWithContext, path) => {
    app.delete(
      path,
      authorizeHandler,
      wrapActionToHandler.delete(deleteActionWithContext),
    );
  },

  deleteOnTwoParams: (app, deleteOnTwoParamsActionWithContext, path) => {
    app.delete(
      path,
      authorizeHandler,
      wrapActionToHandler.deleteOnTwoParams(deleteOnTwoParamsActionWithContext),
    );
  },
};
