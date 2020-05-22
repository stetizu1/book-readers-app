import { Transaction } from './transaction/Transaction';


export type CreateAction<TResult> =
  (body: unknown) => Promise<TResult>;
export type ReadAction<TResult>
  = (param: string) => Promise<TResult>;
export type ReadAllAction<TResult>
  = () => Promise<TResult[]>;
export type UpdateAction<TResult>
  = (param: string, body: unknown) => Promise<TResult>;
export type DeleteAction<TResult>
  = (param: string) => Promise<TResult>;
export type DeleteOnTwoParamsAction<TResult>
  = (param: string, secondParam: string) => Promise<TResult>;

export type UnauthorizedCreateActionWithContext<TResult> =
  (context: Transaction, body: unknown) => Promise<TResult>;
export type UnauthorizedReadActionWithContext<TResult> =
  (context: Transaction, param: string) => Promise<TResult>;

export type CreateActionWithContext<TResult> =
  (context: Transaction, userId: number, body: unknown) => Promise<TResult>;
export type ReadActionWithContext<TResult> =
  (context: Transaction, userId: number, param: string | number) => Promise<TResult>;
export type ReadAllActionWithContext<TResult> =
  (context: Transaction, userId: number) => Promise<TResult[]>;
export type UpdateActionWithContext<TResult> =
  (context: Transaction, userId: number, param: string | number, body: unknown) => Promise<TResult>;
export type DeleteActionWithContext<TResult> =
  (context: Transaction, userId: number, param: string | number) => Promise<TResult>;
export type DeleteOnTwoParamsActionWithContext<TResult> =
  (context: Transaction, userId: number, param: string | number, secondParam: string | number) => Promise<TResult>;
