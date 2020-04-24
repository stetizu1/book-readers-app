import { PoolClient, QueryResultRow } from 'pg';

import { isDate, isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { TransactionCommand } from '../constants/TransactionCommand';
import { TransactionErrorMessage } from '../constants/ErrorMessages';
import { AcceptableParameters, QueryParameter, Transaction } from '../types/transaction/Transaction';
import { NotFoundError } from '../types/http_errors/NotFoundError';


/**
 * Reformat given parameters to string and null, to be used for query.
 * @param params - parameters to reformat
 */
export const stringifyParams = (params: AcceptableParameters[]): QueryParameter[] => (
  params.map((param) => {
    if (isUndefined.or(isNull)(param)) {
      return null;
    }
    if (isDate(param)) {
      return param.toISOString();
    }
    return String(param);
  })
);

/**
 * Implements transaction with commit, rollback and query execution
 */
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

  async executeQuery(query: string, ...values: AcceptableParameters[]): Promise<QueryResultRow[]> {
    if (!this.active) {
      return Promise.reject(new Error(TransactionErrorMessage.notActive));
    }
    const queryResult = await this.client.query(query, stringifyParams(values));
    return queryResult.rows;
  }

  async executeSingleResultQuery(query: string, ...values: AcceptableParameters[]): Promise<QueryResultRow> {
    const rows = await this.executeQuery(query, ...values);
    if (rows.length === 0) {
      return Promise.reject(new NotFoundError());
    }
    return rows[0];
  }

  async executeSingleOrNoResultQuery(query: string, ...values: AcceptableParameters[]): Promise<QueryResultRow | null> {
    const rows = await this.executeQuery(query, ...values);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }
}
