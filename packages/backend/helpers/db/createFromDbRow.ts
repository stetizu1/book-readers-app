import { QueryResultRow } from 'pg';
import { CreateFromDbRow } from '../../types/db/TransformationTypes';

export const createArrayFromDbRows = <T>(rows: QueryResultRow[], createFromDbRow: CreateFromDbRow<T>): T[] => (
  rows.map((row) => createFromDbRow(row))
);
