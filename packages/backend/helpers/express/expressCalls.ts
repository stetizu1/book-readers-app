import { Express } from 'express';

import { Path } from '../../constants/Path';
import { makePath } from '../stringHelpers/makePath';
import {
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
  DeleteWithBodyActionWithContext,
} from '../../types/actionTypes';
import { wrapHandler } from './wrapHandler';


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
export const requests: Requests = {
  post: (app, path, createActionWithContext) => {
    app.post(
      makePath.post(path),
      wrapHandler.create(createActionWithContext),
    );
  },

  get: (app, path, readActionWithContext) => {
    app.get(
      makePath.get(path),
      wrapHandler.read(readActionWithContext),
    );
  },

  getAll: (app, path, readAllActionWithContext) => {
    app.get(
      makePath.getAll(path),
      wrapHandler.readAll(readAllActionWithContext),
    );
  },

  put: (app, path, updateActionWithContext) => {
    app.put(
      makePath.put(path),
      wrapHandler.update(updateActionWithContext),
    );
  },

  delete: (app, path, deleteActionWithContext) => {
    app.delete(
      makePath.delete(path),
      wrapHandler.delete(deleteActionWithContext),
    );
  },

  deleteWithBody: (app, path, deleteWithBodyActionWithContext) => {
    app.delete(
      makePath.deleteWithBody(path),
      wrapHandler.deleteWithBody(deleteWithBodyActionWithContext),
    );
  },
};
