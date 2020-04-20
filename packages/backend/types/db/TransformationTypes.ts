import { QueryResultRow } from 'pg';

export type CreateFromDbRow<T> = (row: QueryResultRow) => T;

export type CreateFromDbRowWithRows<T> = (row: QueryResultRow, rows: QueryResultRow[]) => T;

export type TransformToUpdate<TFrom, TTo> = (original: TFrom) => Required<TTo>;
