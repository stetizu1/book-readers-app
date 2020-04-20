import { QueryResultRow } from 'pg';


export type QueryParams = (string | null)[];

export interface Transaction {
  executeQuery(query: string, values?: QueryParams): Promise<QueryResultRow[]>;

  executeSingleResultQuery(query: string, values: QueryParams): Promise<QueryResultRow>;

  executeSingleOrNoResultQuery(query: string, values: QueryParams): Promise<QueryResultRow | null>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
