import { Transaction } from './Transaction';

export interface StorageContext {
  readonly transaction: Transaction;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
