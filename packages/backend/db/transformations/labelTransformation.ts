import { Label, LabelUpdate } from 'book-app-shared/types/Label';

import { ConvertDbRow, ConvertToUpdate } from '../../types/db/TransformationTypes';


export const convertDbRowToLabel: ConvertDbRow<Label> = (row) => ({
  id: row.id,
  userId: row.userid,
  name: row.name,
  description: row.description,
});

export const convertLabelToLabelUpdate: ConvertToUpdate<Label, LabelUpdate> = (original) => ({
  name: original.name,
  description: original.description,
});
