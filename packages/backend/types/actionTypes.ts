import { StorageContext } from './storage_context/StorageContext';


export enum ActionType {
  ReadAll,
  Read,
  Create,
  Update,
  Delete,
}

export type CreateAction<TResult> = (body: unknown) => Promise<TResult>;
export type ReadAction<TResult> = (id: number) => Promise<TResult>;
export type ReadAllAction<TResult> = () => Promise<TResult>;
export type UpdateAction<TResult> = (id: number, body: unknown) => Promise<TResult>;
export type DeleteAction<TResult> = (id: number) => Promise<TResult>;

export type CreateActionWithContext<TResult> = (context: StorageContext, body: unknown) => Promise<TResult>;
export type ReadActionWithContext<TResult> = (context: StorageContext, id: number) => Promise<TResult>;
export type ReadAllActionWithContext<TResult> = (context: StorageContext) => Promise<TResult>;
export type UpdateActionWithContext<TResult> = (context: StorageContext, id: number, body: unknown) => Promise<TResult>;
export type DeleteActionWithContext<TResult> = (context: StorageContext, id: number) => Promise<TResult>;
