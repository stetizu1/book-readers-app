import { QueryResultRow } from 'pg';
import { Author } from '../../../shared/types/Author';

export const createAuthorFromDbRow = (row: QueryResultRow): Author => ({
  id: row.id,
  name: row.name,
});
