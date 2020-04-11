import { Handler, Request } from 'express';

import {
  ActionType,
  CreateAction, DeleteAction,
  ReadAllAction,
  ReadAction,
  UpdateAction,
} from '../../constants/actionTypes';
import { processError } from './processError';


export type ReadAllWrapper<TResult> = {
  type: ActionType.ReadAll;
  callAction: ReadAllAction<TResult>;
};

const isReadAllWrapper = <TResult>(action: HandleWrapper<TResult>): action is ReadAllWrapper<TResult> => action.type === ActionType.ReadAll;

export type ReadWrapper<TResult> = {
  type: ActionType.Read;
  callAction: ReadAction<TResult>;
};

const isReadWrapper = <TResult>(action: HandleWrapper<TResult>): action is ReadWrapper<TResult> => action.type === ActionType.Read;

export type CreateWrapper<TResult> = {
  type: ActionType.Create;
  callAction: CreateAction<TResult>;
};

const isCreateWrapper = <TResult>(action: HandleWrapper<TResult>): action is CreateWrapper<TResult> => action.type === ActionType.Create;

export type UpdateWrapper<TResult> = {
  type: ActionType.Update;
  callAction: UpdateAction<TResult>;
};

const isUpdateAction = <TResult>(action: HandleWrapper<TResult>): action is UpdateWrapper<TResult> => action.type === ActionType.Update;

export type DeleteWrapper<TResult> = {
  type: ActionType.Delete;
  callAction: DeleteAction<TResult>;
};

const isDeleteAction = <TResult>(action: HandleWrapper<TResult>): action is DeleteWrapper<TResult> => action.type === ActionType.Delete;

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
