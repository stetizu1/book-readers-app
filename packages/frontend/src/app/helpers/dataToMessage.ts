import { isBoolean } from 'book-app-shared/helpers/typeChecks';

import { BooleanMessageYesNo } from 'app/messages/BooleanMessage';


export const booleanToYesNoMessage = (value: boolean): BooleanMessageYesNo => (
  value ? BooleanMessageYesNo.yes : BooleanMessageYesNo.no
);

export const dataToMessage = (value: unknown): string => {
  if (isBoolean(value)) return booleanToYesNoMessage(value);
  return String(value);
};
