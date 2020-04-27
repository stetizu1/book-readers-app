import { HasLabel } from 'book-app-shared/types/HasLabel';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertHasLabelToDbRow: ConvertDbRow<HasLabel> = (row) => ({
  bookDataId: row.bookdataid,
  labelId: row.labelid,
});
