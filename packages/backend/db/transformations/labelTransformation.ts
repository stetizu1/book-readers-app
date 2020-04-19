import { Label, LabelUpdate } from 'book-app-shared/types/Label';

import { CreateFromDbRow, TransformToUpdate } from '../../types/db/TransformationTypes';


export const createLabelFromDbRow: CreateFromDbRow<Label> = (row) => ({
  id: row.id,
  userId: row.userid,
  name: row.name,
  description: row.description,
});

export const transformLabelUpdateFromLabel: TransformToUpdate<Label, LabelUpdate> = (original) => ({
  name: original.name,
  description: original.description,
});
