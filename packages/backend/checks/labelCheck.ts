import {
  isLabelCreate, isLabelUpdate, LabelCreate, LabelUpdate,
} from 'book-app-shared/types/Label';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail, constructCheckResultSuccess } from '../helpers/constructCheckResult';


const checkCreate: MessageCheckFunction<LabelCreate> = (body) => {
  const { userId } = body;
  if (!isValidId(userId)) {
    return CheckResultValue.invalidId;
  }
  return CheckResultValue.success;
};

export const checkLabelCreate: CheckFunction<LabelCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isLabelCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};

export const checkLabelUpdate: CheckFunction<LabelUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isLabelUpdate(normalized)) {
    return constructCheckResultSuccess(normalized);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
