import { CreateFromDbRow } from '../db/TransformationTypes';

export type QueryParameter = string | null;
export type AcceptableParameters = QueryParameter | number | boolean | Date | undefined;


export interface Transaction {
  executeQuery<T>(creator: CreateFromDbRow<T>, query: string, ...values: AcceptableParameters[]): Promise<T[]>;

  executeSingleResultQuery<T>(creator: CreateFromDbRow<T>, query: string, ...values: AcceptableParameters[]): Promise<T>;

  executeSingleOrNoResultQuery<T>(creator: CreateFromDbRow<T>, query: string, ...values: AcceptableParameters[]): Promise<T | null>;

  executeCheck<T>(query: string, ...values: AcceptableParameters[]): Promise<number>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
