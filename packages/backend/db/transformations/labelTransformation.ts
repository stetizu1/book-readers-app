import { QueryResultRow } from 'pg';

import { Label } from 'book-app-shared/types/Label';


export const createLabelFromDbRow = (row: QueryResultRow): Label => ({
  id: row.id,
  userId: row.userid,
  name: row.name,
  description: row.description,
});
