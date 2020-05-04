import { PersonalBookData, PersonalBookDataUpdate } from '../../types/PersonalBookData';
import { ConvertToUpdate } from '../../types/others/ConvertToUpdate';

export const convertPersonalBookDataToPersonalBookDataUpdate: ConvertToUpdate<PersonalBookData, PersonalBookDataUpdate> = (original) => ({
  dateRead: original.dateRead && original.dateRead.toISOString(),
  comment: original.comment,
});
