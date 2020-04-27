import { HasLabel, isHasLabel } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../types/CheckResult';
import { executeCheckCreate } from '../helpers/checks/constructCheckResult';


const check: CheckFunction<HasLabel> = (body) => {
  const { bookDataId, labelId } = body;
  if (!isValidId(bookDataId) || !isValidId(labelId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

export const checkHasLabel: ExportedCheckFunction<HasLabel> = (body, errPrefix, errPostfix) => (
  executeCheckCreate(body, errPrefix, errPostfix, isHasLabel, check)
);
