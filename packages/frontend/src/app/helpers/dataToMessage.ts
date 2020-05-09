import { isBoolean, isString } from 'book-app-shared/helpers/typeChecks';

import { date } from 'book-app-shared/constants/regexp';

import { BooleanMessageYesNo } from 'app/messages/BooleanMessage';
import { SpecialCharacters } from 'app/constants/SpecialCharacters';


export const booleanToYesNoMessage = (value: boolean): BooleanMessageYesNo => (
  value ? BooleanMessageYesNo.yes : BooleanMessageYesNo.no
);

export const dateToMessage = (value: Date): string => `${value.getDate()}.${SpecialCharacters.noBreakSpace}${value.getMonth() + 1}.${SpecialCharacters.noBreakSpace}${value.getFullYear()}`;

export const dataToMessage = (value: unknown): string => {
  if (isBoolean(value)) return booleanToYesNoMessage(value);
  if (isString(value) && date.test(value)) return dateToMessage(new Date(value));
  return String(value);
};
