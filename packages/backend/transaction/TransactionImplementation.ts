import { PoolClient, QueryResultRow } from 'pg';

import { isDate, isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';

import { TransactionCommand } from '../constants/TransactionCommand';
import { TransactionErrorMessage } from '../constants/ErrorMessages';

import { AcceptableParameters, QueryParameter, Transaction } from '../types/transaction/Transaction';
import { NotFoundError } from '../types/http_errors/NotFoundError';
import { CreateFromDbRow } from '../types/db/TransformationTypes';


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

  private async query(query: string, ...values: AcceptableParameters[]): Promise<QueryResultRow[]> {
    if (!this.active) {
      return Promise.reject(new Error(TransactionErrorMessage.notActive));
    }
    const queryResult = await this.client.query(query, stringifyParams(values));
    return queryResult.rows;
  }

  async executeQuery<T>(creator: CreateFromDbRow<T>, query: string, ...values: AcceptableParameters[]): Promise<T[]> {
    const rows = await this.query(query, ...values);
    return rows.map((row) => creator(row));
  }

  async executeSingleOrNoResultQuery<T>(creator: CreateFromDbRow<T>, query: string, ...values: AcceptableParameters[]): Promise<T | null> {
    const rows = await this.executeQuery(creator, query, ...values);
    return rows.length > 0 ? rows[0] : null;
  }

  async executeSingleResultQuery<T>(creator: CreateFromDbRow<T>, query: string, ...values: AcceptableParameters[]): Promise<T> {
    const result = await this.executeSingleOrNoResultQuery(creator, query, ...values);
    if (isNull(result)) {
      return Promise.reject(new NotFoundError());
    }
    return result;
  }

  async executeCheck(query: string, ...values: AcceptableParameters[]): Promise<boolean> {
    const rows = await this.query(query, ...values);
    return rows.length > 0;
  }
}
