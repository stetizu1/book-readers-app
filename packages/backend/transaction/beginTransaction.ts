import { TransactionCommand } from '../constants/TransactionCommand';
import { Transaction } from '../types/transaction/Transaction';
import { TransactionImplementation } from './TransactionImplementation';
import { pool } from '../db/pool';


export const beginTransaction = async (): Promise<Transaction> => {
  const client = await pool.connect();

  try {
    await client.query(TransactionCommand.begin);
  } catch (error) {
    client.release();
    return Promise.reject(error);
  }
  return new TransactionImplementation(client);
};
