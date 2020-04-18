import { QueryResultRow } from 'pg';
import { CreateFromDbRow } from '../../types/db/TransformationTypes';

export const createArrayFromDbRows = async <T>(rows: QueryResultRow[], createFromDbRow: CreateFromDbRow<T>): Promise<T[]> => (
  Promise.all(
    rows.map((row) => createFromDbRow(row)),
  )
);
