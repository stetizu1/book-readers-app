import { Handler } from 'express';

import {
  UpdateActionWithContext,
  CreateActionWithContext,
  DeleteActionWithContext,
  ReadActionWithContext, ReadAllActionWithContext,
} from '../../types/actionTypes';
import { processError } from './processError';
import { executeWithContext } from './executeWithContext';


/**
 * Wraps required requests and return values. Provides context to action, binds response and processes error.
 */
export const wrapHandler = {
  create: <TResult>(action: CreateActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContext.create(action)(request.body)
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  read: <TResult>(action: ReadActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContext.read(action)(Number(request.params.id))
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  readAll: <TResult>(action: ReadAllActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContext.readAll(action)()
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  update: <TResult>(action: UpdateActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContext.update(action)(Number(request.params.id), request.body)
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),

  delete: <TResult>(action: DeleteActionWithContext<TResult>): Handler => (
    (request, response): void => {
      executeWithContext.delete(action)(Number(request.params.id))
        .then(response.send.bind(response))
        .catch((error) => processError(response, error));
    }
  ),
};
