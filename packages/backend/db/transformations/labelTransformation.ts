import { Label } from 'book-app-shared/types/Label';

import { CreateFromDbRow } from '../../types/db/TransformationTypes';


export const createLabelFromDbRow: CreateFromDbRow<Label> = (row) => ({
  id: row.id,
  userId: row.userid,
  name: row.name,
  description: row.description,
});
