import { Pool, PoolClient, QueryResultRow } from 'pg';
import { Transaction } from './Transaction';
import { TRANSACTION_NOT_ACTIVE, TRANSACTION_SINGLE_NOT_FOUND } from '../constants/errorMessages';

export class TransactionImpl implements Transaction {
  private client: PoolClient;

  private active: boolean;

  constructor(client: PoolClient) {
    this.client = client;
    this.active = true;
  }

  static beginTransaction = async (pool: Pool): Promise<Transaction> => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
    } catch (error) {
      client.release();
      return Promise.reject(error);
    }
    return new TransactionImpl(client);
  };

  async executeQuery(query: string, values: Array<string | null>): Promise<Array<QueryResultRow>> {
    if (!this.active) {
      return Promise.reject(new Error(TRANSACTION_NOT_ACTIVE));
    }
    const res = await this.client.query(query, values);
    return res.rows;
  }

  async executeSingleResultQuery(query: string, values: Array<string | null>): Promise<QueryResultRow> {
    const rows = await this.executeQuery(query, values);
    if (rows.length === 0) {
      return Promise.reject(new Error(TRANSACTION_SINGLE_NOT_FOUND));
    }
    return rows[0];
  }

  async executeSingleOrNoResultQuery(query: string, values: Array<string | null>): Promise<QueryResultRow | null> {
    const rows = await this.executeQuery(query, values);
    if (rows.length === 0) return null;
    return rows[0];
  }

  async commit(): Promise<void> {
    this.active = false;
    try {
      await this.client.query('COMMIT');
    } finally {
      this.client.release();
    }
  }

  async rollback(): Promise<void> {
    this.active = false;
    try {
      await this.client.query('ROLLBACK');
    } catch (error) {
      console.error(error);
    } finally {
      this.client.release();
    }
  }
}
