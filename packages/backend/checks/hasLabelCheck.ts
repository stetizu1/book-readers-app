import { HasLabelCreate, isHasLabelCreate } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResultFail, constructCheckResult } from '../helpers/checks/constructCheckResult';


const checkCreate: MessageCheckFunction<HasLabelCreate> = (body) => {
  const { bookDataId, labelId } = body;
  if (!isValidId(bookDataId) || !isValidId(labelId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

export const checkHasLabelCreate: CheckFunction<HasLabelCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isHasLabelCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
