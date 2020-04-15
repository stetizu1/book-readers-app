import { HasLabel } from 'book-app-shared/types/HasLabel';

import { CreateFromDbRow } from '../createFromDbRow';


export const createHasLabelFromDbRow: CreateFromDbRow<HasLabel> = (row) => ({
  bookDataId: row.bookdataid,
  labelId: row.labelid,
});
