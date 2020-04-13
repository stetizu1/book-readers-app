import { QueryResultRow } from 'pg';

import { HasLabel } from 'book-app-shared/types/HasLabel';


export const createHasLabelFromDbRow = (row: QueryResultRow): HasLabel => ({
  bookDataId: row.bookdataid,
  labelId: row.labelid,
});
