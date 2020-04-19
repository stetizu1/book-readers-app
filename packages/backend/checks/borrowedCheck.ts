import {
  BorrowedCreate, BorrowedUpdate, isBorrowedCreate, isBorrowedUpdate,
} from 'book-app-shared/types/Borrowed';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResultFail, constructCheckResult } from '../helpers/constructCheckResult';
import { checkMultiple } from '../helpers/checkMultiple';


const checkCommon: MessageCheckFunction<BorrowedCreate | BorrowedUpdate> = (body) => {
  const { userBorrowedId, until } = body;
  if (!isUndefined.or(isNull)(userBorrowedId) && !isValidId(userBorrowedId)) {
    return CheckResultValue.invalidId;
  }

  if (!isUndefined.or(isNull)(until) && !isValidDate(until)) {
    return CheckResultValue.invalidDate;
  }
  return CheckResultValue.success;
};

const checkCreate: MessageCheckFunction<BorrowedCreate> = (body) => {
  const { userId, bookDataId, userBorrowedId } = body;
  if (!isValidId(userId) || !isValidId(bookDataId)) {
    return CheckResultValue.invalidId;
  }
  if (!isUndefined(userBorrowedId) && userId === userBorrowedId) {
    return CheckResultValue.borrowSameIdGiven;
  }
  return CheckResultValue.success;
};

const checkUpdate: MessageCheckFunction<BorrowedUpdate> = (body) => {
  const { returned } = body;
  if (!isUndefined(returned) && !returned) {
    return CheckResultValue.borrowInvalidReturned;
  }
  return CheckResultValue.success;
};


export const checkBorrowedCreate: CheckFunction<BorrowedCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBorrowedCreate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCreate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};

export const checkBorrowedUpdate: CheckFunction<BorrowedUpdate> = ((body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isBorrowedUpdate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkUpdate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
});
