import { QueryResultRow } from 'pg';

export type CreateFromDbRow<T> = (row: QueryResultRow) => T;

export type CreateFromRowWithRows<T> = (row: QueryResultRow, rows: QueryResultRow[]) => T;
