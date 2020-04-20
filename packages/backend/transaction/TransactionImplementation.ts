import { PoolClient, QueryResultRow } from 'pg';

import { TransactionCommand } from '../constants/TransactionCommand';
import { TransactionErrorMessage } from '../constants/ErrorMessages';
import { QueryParams, Transaction } from '../types/transaction/Transaction';
import { NotFoundError } from '../types/http_errors/NotFoundError';


export class TransactionImplementation implements Transaction {
  private client: PoolClient;

  private active: boolean;

  constructor(client: PoolClient) {
    this.client = client;
    this.active = true;
  }

  async commit(): Promise<void> {
    this.active = false;
    try {
      await this.client.query(TransactionCommand.commit);
    } catch (error) {
      console.error(error);
      Promise.reject(new Error(TransactionErrorMessage.unableToCommit));
    } finally {
      this.client.release();
    }
  }

  async rollback(): Promise<void> {
    this.active = false;
    try {
      await this.client.query(TransactionCommand.rollback);
    } catch (error) {
      console.error(error);
    } finally {
      this.client.release();
    }
  }

  async executeQuery(query: string, values?: QueryParams): Promise<QueryResultRow[]> {
    if (!this.active) {
      return Promise.reject(new Error(TransactionErrorMessage.notActive));
    }
    const queryResult = await this.client.query(query, values);
    return queryResult.rows;
  }

  async executeSingleResultQuery(query: string, values: QueryParams): Promise<QueryResultRow> {
    const rows = await this.executeQuery(query, values);
    if (rows.length === 0) {
      return Promise.reject(new NotFoundError());
    }
    return rows[0];
  }

  async executeSingleOrNoResultQuery(query: string, values: QueryParams): Promise<QueryResultRow | null> {
    const rows = await this.executeQuery(query, values);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }
}
