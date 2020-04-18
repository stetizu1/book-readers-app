import { Application } from 'express';

import { makePath, Path } from '../../constants/paths';
import {
  CreateActionWithContext, DeleteActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
} from '../../types/actionTypes';
import { wrapHandler } from './wrapHandler';


export interface Requests {
  post: <T>(app: Application, path: Path, createActionWithContext: CreateActionWithContext<T>) => void;
  get: <T>(app: Application, path: Path, readActionWithContext: ReadActionWithContext<T>) => void;
  getAll: <T>(app: Application, path: Path, readAllActionWithContext: ReadAllActionWithContext<T>) => void;
  put: <T>(app: Application, path: Path, updateActionWithContext: UpdateActionWithContext<T>) => void;
  delete: <T>(app: Application, path: Path, deleteActionWithContext: DeleteActionWithContext<T>) => void;
}

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
    app.get(
      makePath.post(path),
      wrapHandler.delete(deleteActionWithContext),
    );
  },
};
