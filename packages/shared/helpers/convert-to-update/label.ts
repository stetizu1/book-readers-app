import { Label, LabelUpdate } from '../../types/Label';
import { ConvertToUpdate } from '../../types/others/ConvertToUpdate';

export const convertLabelToLabelUpdate: ConvertToUpdate<Label, LabelUpdate> = (original) => ({
  name: original.name,
  description: original.description,
});
