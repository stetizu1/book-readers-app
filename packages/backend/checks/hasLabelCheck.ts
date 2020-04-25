import { HasLabel, isHasLabel } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { MessageCheckFunction, CheckFunction } from '../types/CheckResult';
import { checkCreate } from '../helpers/checks/constructCheckResult';


const checkWithMessage: MessageCheckFunction<HasLabel> = (body) => {
  const { bookDataId, labelId } = body;
  if (!isValidId(bookDataId) || !isValidId(labelId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

export const checkHasLabel: CheckFunction<HasLabel> = (body, errPrefix, errPostfix) => (
  checkCreate(isHasLabel, checkWithMessage, body, errPrefix, errPostfix)
);
