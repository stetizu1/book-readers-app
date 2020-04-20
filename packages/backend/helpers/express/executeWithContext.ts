import {
  CreateAction,
  ReadAction,
  ReadAllAction,
  UpdateAction,
  DeleteAction,
  CreateActionWithContext,
  ReadActionWithContext,
  ReadAllActionWithContext,
  UpdateActionWithContext,
  DeleteActionWithContext,
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
export const executeWithContext = {
  create: <TResult>(action: CreateActionWithContext<TResult>): CreateAction<TResult> => (
    (body): Promise<TResult> => executeAndCommit((context) => action(context, body))
  ),

  read: <TResult>(action: ReadActionWithContext<TResult>): ReadAction<TResult> => (
    (id): Promise<TResult> => executeAndCommit((context) => action(context, id))
  ),

  readAll: <TResult>(action: ReadAllActionWithContext<TResult>): ReadAllAction<TResult> => (
    (): Promise<TResult[]> => executeAndCommit((context) => action(context))
  ),

  update: <TResult>(action: UpdateActionWithContext<TResult>): UpdateAction<TResult> => (
    (id, body): Promise<TResult> => executeAndCommit((context) => action(context, id, body))
  ),

  delete: <TResult>(action: DeleteActionWithContext<TResult>): DeleteAction<TResult> => (
    (id): Promise<TResult> => executeAndCommit((context) => action(context, id))
  ),
};
