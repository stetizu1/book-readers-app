import { QueryResultRow } from 'pg';

export interface Transaction {
  executeQuery(query: string, values: (string | null)[]): Promise<QueryResultRow[]>;

  executeSingleResultQuery(query: string, values: (string | null)[]): Promise<QueryResultRow>;

  executeSingleOrNoResultQuery(query: string, values: (string | null)[]): Promise<QueryResultRow | null>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
