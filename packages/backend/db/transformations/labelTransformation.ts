import { Label } from 'book-app-shared/types/Label';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertDbRowToLabel: ConvertDbRow<Label> = (row) => ({
  id: row.id,
  userId: row.userid,
  name: row.name,
  description: row.description,
});
