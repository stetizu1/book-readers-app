import { QueryResultRow } from 'pg';

export type CreateFromDbRow<T> = (row: QueryResultRow) => T;

export type ComposeObjectAndArrayTo<T, U, V> = (row: U, rows: V[]) => T;

export type TransformToUpdate<TFrom, TTo> = (original: TFrom) => Required<TTo>;
