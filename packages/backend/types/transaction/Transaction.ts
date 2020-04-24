import { QueryResultRow } from 'pg';

export type QueryParameter = string | null;
export type AcceptableParameters = QueryParameter | number | boolean | Date | undefined;


export interface Transaction {
  executeQuery(query: string, ...values: AcceptableParameters[]): Promise<QueryResultRow[]>;

  executeSingleResultQuery(query: string, ...values: AcceptableParameters[]): Promise<QueryResultRow>;

  executeSingleOrNoResultQuery(query: string, ...values: AcceptableParameters[]): Promise<QueryResultRow | null>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
