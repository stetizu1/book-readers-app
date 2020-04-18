import { QueryResultRow } from 'pg';

export type CreateFromDbRow<T> = (row: QueryResultRow) => T;

export type CreateFromRowWithRows<T> = (row: QueryResultRow, rows: QueryResultRow[]) => T;

export const createArrayFromDbRows = async <T>(rows: QueryResultRow[], createFromDbRow: CreateFromDbRow<T>): Promise<T[]> => (
  Promise.all(
    rows.map((row) => createFromDbRow(row)),
  )
);
