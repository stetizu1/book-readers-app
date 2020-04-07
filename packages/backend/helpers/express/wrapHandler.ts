import { Handler, Request } from 'express';

import { processError } from './processError';
import {
  ActionTypes,
  CreateAction, DeleteAction,
  ReadAllAction,
  ReadAction,
  UpdateAction,
} from '../../constants/ActionTypes';


export type ReadAllWrapper<TResult> = {
  type: ActionTypes.ReadAll;
  callAction: ReadAllAction<TResult>;
};

const isReadAllWrapper = <TResult>(action: HandleWrapper<TResult>): action is ReadAllWrapper<TResult> => action.type === ActionTypes.ReadAll;

export type ReadWrapper<TResult> = {
  type: ActionTypes.Read;
  callAction: ReadAction<TResult>;
};

const isReadWrapper = <TResult>(action: HandleWrapper<TResult>): action is ReadWrapper<TResult> => action.type === ActionTypes.Read;

export type CreateWrapper<TResult> = {
  type: ActionTypes.Create;
  callAction: CreateAction<TResult>;
};

const isCreateWrapper = <TResult>(action: HandleWrapper<TResult>): action is CreateWrapper<TResult> => action.type === ActionTypes.Create;

export type UpdateWrapper<TResult> = {
  type: ActionTypes.Update;
  callAction: UpdateAction<TResult>;
};

const isUpdateAction = <TResult>(action: HandleWrapper<TResult>): action is UpdateWrapper<TResult> => action.type === ActionTypes.Update;

export type DeleteWrapper<TResult> = {
  type: ActionTypes.Delete;
  callAction: DeleteAction<TResult>;
};

const isDeleteAction = <TResult>(action: HandleWrapper<TResult>): action is DeleteWrapper<TResult> => action.type === ActionTypes.Delete;

export type HandleWrapper<TResult> =
  ReadAllWrapper<TResult>
  | ReadWrapper<TResult>
  | CreateWrapper<TResult>
  | UpdateWrapper<TResult>
  | DeleteWrapper<TResult>;

const callActionWithRequest = <TResult>(action: HandleWrapper<TResult>, request: Request): Promise<TResult> => {
  if (isUpdateAction<TResult>(action)) return action.callAction(Number(request.params.id), request.body);
  if (isReadAllWrapper<TResult>(action)) return action.callAction();
  if (isReadWrapper<TResult>(action) || isDeleteAction<TResult>(action)) return action.callAction(Number(request.params.id));
  if (isCreateWrapper<TResult>(action)) return action.callAction(request.body);
  throw new Error('Incorrect action parameter');
};

export const wrapHandler = <TResult = void>(action: HandleWrapper<TResult>): Handler => (
  (request, response): void => {
    callActionWithRequest(action, request)
      .then(response.send.bind(response))
      .catch((error) => processError(response, error));
  }
);
