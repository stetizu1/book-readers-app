import { HasLabelCreate, isHasLabelCreate } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResultFail, constructCheckResult } from '../helpers/constructCheckResult';

const checkCreate: MessageCheckFunction<HasLabelCreate> = (body) => {
  const { bookDataId, labelId } = body;
  if (!isValidId(bookDataId) || !isValidId(labelId)) {
    return CheckResultValue.invalidId;
  }
  return CheckResultValue.success;
};

export const checkHasLabelCreate: CheckFunction<HasLabelCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isHasLabelCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
