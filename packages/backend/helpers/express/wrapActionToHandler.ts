import { Handler } from 'express';

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
import { processError } from './processError';
import { executeWithContextAuthorized, executeWithContextUnauthorized } from './executeWithContext';


export const wrapUnauthorizedActionToHandler = {
  create: <TResult>(action: UnauthorizedCreateActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContextUnauthorized.create(action)(request.body)
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  read: <TResult>(action: UnauthorizedReadActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContextUnauthorized.read(action)(request.params.param)
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),
};

/**
 * Wraps required requests and return values. Provides context to action, binds response and processes error.
 */
export const wrapActionToHandler = {
  create: <TResult>(action: CreateActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContextAuthorized.create(action, Number(request.params.userId))(request.body)
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  read: <TResult>(action: ReadActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContextAuthorized.read(action, Number(request.params.userId))(request.params.param)
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  readAll: <TResult>(action: ReadAllActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContextAuthorized.readAll(action, Number(request.params.userId))()
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  update: <TResult>(action: UpdateActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContextAuthorized.update(action, Number(request.params.userId))(request.params.param, request.body)
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  delete: <TResult>(action: DeleteActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContextAuthorized.delete(action, Number(request.params.userId))(request.params.param)
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  deleteOnTwoParams: <TResult>(action: DeleteOnTwoParamsActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContextAuthorized.deleteWithTwoParams(action, Number(request.params.userId))(request.params.param, request.params.secondParam)
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),
};
