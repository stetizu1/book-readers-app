import { Express } from 'express';

import { Path, PathSpecification, PathPostfix } from 'book-app-shared/constants/Path';
import { constructPath } from 'book-app-shared/helpers/makePath';
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
  post: <T>(app: Express, action: UnauthorizedCreateActionWithContext<T>, path: Path, ...pathSpec: PathSpecification[]) => void;
  get: <T>(app: Express, action: UnauthorizedReadActionWithContext<T>, path: Path, ...pathSpec: PathSpecification[]) => void;
}

interface Requests {
  post: <T>(app: Express, action: CreateActionWithContext<T>, path: Path, ...pathSpec: PathSpecification[]) => void;
  get: <T>(app: Express, action: ReadActionWithContext<T>, path: Path, ...pathSpec: PathSpecification[]) => void;
  getAll: <T>(app: Express, action: ReadAllActionWithContext<T>, path: Path, ...pathSpec: PathSpecification[]) => void;
  put: <T>(app: Express, action: UpdateActionWithContext<T>, path: Path, ...pathSpec: PathSpecification[]) => void;
  delete: <T>(app: Express, action: DeleteActionWithContext<T>, path: Path, ...pathSpec: PathSpecification[]) => void;
  deleteWithBody: <T>(app: Express, action: DeleteWithBodyActionWithContext<T>, path: Path, ...pathSpec: PathSpecification[]) => void;
}

/**
 * Wraps request path to required format and provides context to given action.
 */
export const unauthorizedRequests: UnauthorizedRequests = {
  post: (app, createActionWithContext, path, ...pathSpec) => {
    app.post(
      constructPath.post(path, pathSpec),
      wrapUnauthorizedActionToHandler.create(createActionWithContext),
    );
  },

  get: (app, readActionWithContext, path, ...pathSpec) => {
    app.get(
      constructPath.get(path, PathPostfix.param, pathSpec),
      wrapUnauthorizedActionToHandler.read(readActionWithContext),
    );
  },
};

/**
 * Wraps request path to required format and provides context and userId to given action. Adds authorization.
 */
export const requests: Requests = {
  post: (app, createActionWithContext, path, ...pathSpec) => {
    app.post(
      constructPath.post(path, pathSpec),
      authorizeHandler,
      wrapActionToHandler.create(createActionWithContext),
    );
  },

  get: (app, readActionWithContext, path, ...pathSpec) => {
    app.get(
      constructPath.get(path, PathPostfix.param, pathSpec),
      authorizeHandler,
      wrapActionToHandler.read(readActionWithContext),
    );
  },

  getAll: (app, readAllActionWithContext, path, ...pathSpec) => {
    app.get(
      constructPath.getAll(path, pathSpec),
      authorizeHandler,
      wrapActionToHandler.readAll(readAllActionWithContext),
    );
  },

  put: (app, updateActionWithContext, path, ...pathSpec) => {
    app.put(
      constructPath.put(path, PathPostfix.param, pathSpec),
      authorizeHandler,
      wrapActionToHandler.update(updateActionWithContext),
    );
  },

  delete: (app, deleteActionWithContext, path, ...pathSpec) => {
    app.delete(
      constructPath.delete(path, PathPostfix.param, pathSpec),
      authorizeHandler,
      wrapActionToHandler.delete(deleteActionWithContext),
    );
  },

  deleteWithBody: (app, deleteWithBodyActionWithContext, path, ...pathSpec) => {
    app.delete(
      constructPath.deleteWithBody(path, pathSpec),
      authorizeHandler,
      wrapActionToHandler.deleteWithBody(deleteWithBodyActionWithContext),
    );
  },
};
