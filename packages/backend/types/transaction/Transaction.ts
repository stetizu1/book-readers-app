import { ConvertDbRow } from '../db/TransformationTypes';

export type QueryParameter = string | null;
export type AcceptableParameters = QueryParameter | number | boolean | Date | undefined;


export interface Transaction {
  executeQuery<T>(creator: ConvertDbRow<T>, query: string, ...values: AcceptableParameters[]): Promise<T[]>;

  executeSingleResultQuery<T>(creator: ConvertDbRow<T>, query: string, ...values: AcceptableParameters[]): Promise<T>;

  executeSingleOrNoResultQuery<T>(creator: ConvertDbRow<T>, query: string, ...values: AcceptableParameters[]): Promise<T | null>;

  executeCheck<T>(query: string, ...values: AcceptableParameters[]): Promise<boolean>;

  commit(): Promise<void>;

  rollback(): Promise<void>;
}
