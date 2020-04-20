import {
  isLabelCreate, isLabelUpdate, LabelCreate, LabelUpdate,
} from 'book-app-shared/types/Label';
import { isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail, constructCheckResultSuccess } from '../helpers/checks/constructCheckResult';


const checkCreate: MessageCheckFunction<LabelCreate> = (body) => {
  const { userId } = body;
  if (!isValidId(userId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

export const checkLabelCreate: CheckFunction<LabelCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isLabelCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};

export const checkLabelUpdate: CheckFunction<LabelUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isLabelUpdate(normalized)) {
    return constructCheckResultSuccess(normalized);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
