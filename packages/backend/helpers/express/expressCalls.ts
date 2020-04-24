import { Express } from 'express';

import { Path } from '../../constants/Path';
import { makePath } from '../stringHelpers/makePath';
import {
  UnauthorizedCreateActionWithContext,
  UnauthorizedReadActionWithContext,
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
  DeleteWithBodyActionWithContext,
} from '../../types/actionTypes';
import { wrapActionToHandler, wrapUnauthorizedActionToHandler } from './wrapActionToHandler';
import { authorizeHandler } from './authorizeHandler';


interface UnauthorizedRequests {
  post: <T>(app: Express, path: Path, action: UnauthorizedCreateActionWithContext<T>) => void;
  get: <T>(app: Express, path: Path, action: UnauthorizedReadActionWithContext<T>) => void;
}

interface Requests {
  post: <T>(app: Express, path: Path, action: CreateActionWithContext<T>) => void;
  get: <T>(app: Express, path: Path, action: ReadActionWithContext<T>) => void;
  getAll: <T>(app: Express, path: Path, action: ReadAllActionWithContext<T>) => void;
  put: <T>(app: Express, path: Path, action: UpdateActionWithContext<T>) => void;
  delete: <T>(app: Express, path: Path, action: DeleteActionWithContext<T>) => void;
  deleteWithBody: <T>(app: Express, path: Path, action: DeleteWithBodyActionWithContext<T>) => void;
}

/**
 * Wraps request path to required format and provides context to given action.
 */
export const unauthorizedRequests: UnauthorizedRequests = {
  post: (app, path, createActionWithContext) => {
    app.post(
      makePath.post(path),
      wrapUnauthorizedActionToHandler.create(createActionWithContext),
    );
  },

  get: (app, path, readActionWithContext) => {
    app.get(
      makePath.get(path),
      wrapUnauthorizedActionToHandler.read(readActionWithContext),
    );
  },
};

/**
 * Wraps request path to required format and provides context and userId to given action. Adds authorization.
 */
export const requests: Requests = {
  post: (app, path, createActionWithContext) => {
    app.post(
      makePath.post(path),
      authorizeHandler,
      wrapActionToHandler.create(createActionWithContext),
    );
  },

  get: (app, path, readActionWithContext) => {
    app.get(
      makePath.get(path),
      authorizeHandler,
      wrapActionToHandler.read(readActionWithContext),
    );
  },

  getAll: (app, path, readAllActionWithContext) => {
    app.get(
      makePath.getAll(path),
      authorizeHandler,
      wrapActionToHandler.readAll(readAllActionWithContext),
    );
  },

  put: (app, path, updateActionWithContext) => {
    app.put(
      makePath.put(path),
      authorizeHandler,
      wrapActionToHandler.update(updateActionWithContext),
    );
  },

  delete: (app, path, deleteActionWithContext) => {
    app.delete(
      makePath.delete(path),
      authorizeHandler,
      wrapActionToHandler.delete(deleteActionWithContext),
    );
  },

  deleteWithBody: (app, path, deleteWithBodyActionWithContext) => {
    app.delete(
      makePath.deleteWithBody(path),
      authorizeHandler,
      wrapActionToHandler.deleteWithBody(deleteWithBodyActionWithContext),
    );
  },
};
