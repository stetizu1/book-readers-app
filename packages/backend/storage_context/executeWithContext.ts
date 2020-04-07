import { StorageContext } from './StorageContext';
import { StorageContextFactory } from './StorageContextImpl';
import {
  CreateAction,
  DeleteAction,
  ReadAllAction,
  ReadAction,
  UpdateAction,
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
} from '../constants/ActionTypes';

type ContextFunction<TResult> = (context: StorageContext) => Promise<TResult>;

const executeAndCommit = async <TResult>(operation: ContextFunction<TResult>): Promise<TResult> => {
  const context: StorageContext = await StorageContextFactory();
  try {
    const result = await operation(context);
    await context.commit();
    return result;
  } catch (error) {
    await context.rollback();
    return Promise.reject(error);
  }
};

export const executeWithContext = {
  create: <TResult>(action: CreateActionWithContext<TResult>): CreateAction<TResult> => (
    (body): Promise<TResult> => executeAndCommit((context) => action(context, body))
  ),

  read: <TResult>(action: ReadActionWithContext<TResult>): ReadAction<TResult> => (
    (id): Promise<TResult> => executeAndCommit((context) => action(context, id))
  ),

  readAll: <TResult>(action: ReadAllActionWithContext<TResult>): ReadAllAction<TResult> => (
    (): Promise<TResult> => executeAndCommit((context) => action(context))
  ),

  update: <TResult>(action: UpdateActionWithContext<TResult>): UpdateAction<TResult> => (
    (id, body): Promise<TResult> => executeAndCommit((context) => action(context, id, body))
  ),

  delete: <TResult>(action: DeleteActionWithContext<TResult>): DeleteAction<TResult> => (
    (id): Promise<TResult> => executeAndCommit((context) => action(context, id))
  ),
};
