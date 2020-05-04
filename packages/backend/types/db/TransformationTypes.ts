import { QueryResultRow } from 'pg';

export type ConvertDbRow<T> = (row: QueryResultRow) => T;

export type ConvertToComposed<T, U, V> = (row: T, rows: U[]) => V;
