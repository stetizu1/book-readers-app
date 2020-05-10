import { isNull } from '../typeChecks';

import { PersonalBookData, PersonalBookDataUpdate } from '../../types/PersonalBookData';
import { ConvertToUpdate } from '../../types/others/ConvertToUpdate';

export const convertPersonalBookDataToPersonalBookDataUpdate: ConvertToUpdate<PersonalBookData | null, PersonalBookDataUpdate> = (original) => ({
  dateRead: !isNull(original) ? original.dateRead : null,
  comment: !isNull(original) ? original.comment : null,
});
