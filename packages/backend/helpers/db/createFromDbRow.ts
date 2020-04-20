import { QueryResultRow } from 'pg';
import { CreateFromDbRow } from '../../types/db/TransformationTypes';

/**
 * Creates array of objects from database rows
 * @param rows - rows array returned by query
 * @param createFromDbRow - function to construct single object from db row
 */
export const createArrayFromDbRows = <T>(rows: QueryResultRow[], createFromDbRow: CreateFromDbRow<T>): T[] => (
  rows.map((row) => createFromDbRow(row))
);
