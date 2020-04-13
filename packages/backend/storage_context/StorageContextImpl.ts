import { StorageContext } from '../types/storage_context/StorageContext';
import { TRANSACTION_ERROR } from '../constants/errorMessages';
import { TransactionImpl } from './TransactionImpl';
import { pool } from '../db/poolSettings';
import { Transaction } from '../types/storage_context/Transaction';


class StorageContextImpl implements StorageContext {
  constructor(public readonly transaction: Transaction) {
    this.transaction = transaction;
  }

  async commit(): Promise<void> {
    try {
      await this.transaction.commit();
    } catch (error) {
      console.error(error);
      Promise.reject(new Error(TRANSACTION_ERROR));
    }
  }

  async rollback(): Promise<void> {
    await this.transaction.rollback();
  }
}

export const StorageContextFactory = async (): Promise<StorageContextImpl> => {
  const transaction = await TransactionImpl.beginTransaction(pool);
  return new StorageContextImpl(transaction);
};
