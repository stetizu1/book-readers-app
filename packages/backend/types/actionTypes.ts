import { Transaction } from './transaction/Transaction';


export type CreateAction<TResult> = (body: unknown) => Promise<TResult>;
export type ReadAction<TResult> = (id: string) => Promise<TResult>;
export type ReadAllAction<TResult> = () => Promise<TResult[]>;
export type UpdateAction<TResult> = (id: string, body: unknown) => Promise<TResult>;
export type DeleteAction<TResult> = (id: string) => Promise<TResult>;
export type DeleteWithBodyAction<TResult> = (body: unknown) => Promise<TResult>;

export type CreateActionWithContext<TResult> = (context: Transaction, body: unknown) => Promise<TResult>;
export type ReadActionWithContext<TResult> = (context: Transaction, id: string) => Promise<TResult>;
export type ReadAllActionWithContext<TResult> = (context: Transaction) => Promise<TResult[]>;
export type UpdateActionWithContext<TResult> = (context: Transaction, id: string, body: unknown) => Promise<TResult>;
export type DeleteActionWithContext<TResult> = (context: Transaction, id: string) => Promise<TResult>;
export type DeleteWithBodyActionWithContext<TResult> = (context: Transaction, body: unknown) => Promise<TResult>;
