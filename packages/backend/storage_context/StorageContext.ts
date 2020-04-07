import { Transaction } from './Transaction';

export interface StorageContext {
  transaction: Transaction;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
