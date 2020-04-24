import {
  CreateAction,
  ReadAction,
  ReadAllAction,
  UpdateAction,
  DeleteAction,
  DeleteWithBodyAction,
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
  DeleteWithBodyActionWithContext, UnauthorizedCreateActionWithContext, UnauthorizedReadActionWithContext,
} from '../../types/actionTypes';
import { beginTransaction } from '../../transaction/beginTransaction';
import { Transaction } from '../../types/transaction/Transaction';


type ContextFunction<TResult> = (transactionContext: Transaction) => Promise<TResult>;

const executeAndCommit = async <TResult>(operation: ContextFunction<TResult>): Promise<TResult> => {
  const transaction = await beginTransaction();
  try {
    const result = await operation(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};

/**
 * Takes action that needs context. Returns action that takes parameters without context and calls original function on created context.
 */
export const executeWithContextUnauthorized = {
  create: <TResult>(action: UnauthorizedCreateActionWithContext<TResult>): CreateAction<TResult> => (
    (body): Promise<TResult> => executeAndCommit((context) => action(context, body))
  ),

  read: <TResult>(action: UnauthorizedReadActionWithContext<TResult>): ReadAction<TResult> => (
    (param): Promise<TResult> => executeAndCommit((context) => action(context, param))
  ),
};

/**
 * Takes action that needs context and id of logged in user. Returns action that takes only request  parameters without context and calls original function on created context.
 */
export const executeWithContextAuthorized = {
  create: <TResult>(action: CreateActionWithContext<TResult>, userId: number): CreateAction<TResult> => (
    (body): Promise<TResult> => executeAndCommit((context) => action(context, userId, body))
  ),

  read: <TResult>(action: ReadActionWithContext<TResult>, userId: number): ReadAction<TResult> => (
    (param): Promise<TResult> => executeAndCommit((context) => action(context, userId, param))
  ),

  readAll: <TResult>(action: ReadAllActionWithContext<TResult>, userId: number): ReadAllAction<TResult> => (
    (): Promise<TResult[]> => executeAndCommit((context) => action(context, userId))
  ),

  update: <TResult>(action: UpdateActionWithContext<TResult>, userId: number): UpdateAction<TResult> => (
    (param, body): Promise<TResult> => executeAndCommit((context) => action(context, userId, param, body))
  ),

  delete: <TResult>(action: DeleteActionWithContext<TResult>, userId: number): DeleteAction<TResult> => (
    (param): Promise<TResult> => executeAndCommit((context) => action(context, userId, param))
  ),

  deleteWithBody: <TResult>(action: DeleteWithBodyActionWithContext<TResult>, userId: number): DeleteWithBodyAction<TResult> => (
    (body): Promise<TResult> => executeAndCommit((context) => action(context, userId, body))
  ),
};
