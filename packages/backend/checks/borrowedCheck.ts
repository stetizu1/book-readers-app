import {
  BorrowedCreate, BorrowedUpdate, isBorrowedCreate, isBorrowedUpdate,
} from 'book-app-shared/types/Borrowed';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResultFail, constructCheckResult } from '../helpers/checks/constructCheckResult';
import { checkMultiple } from '../helpers/checks/checkMultiple';


const checkCommon: MessageCheckFunction<BorrowedCreate | BorrowedUpdate> = (body) => {
  const { userBorrowedId, until } = body;
  if (!isUndefined.or(isNull)(userBorrowedId) && !isValidId(userBorrowedId)) {
    return CheckResultMessage.invalidId;
  }

  if (!isUndefined.or(isNull)(until) && !isValidDate(until)) {
    return CheckResultMessage.invalidDate;
  }
  return CheckResultMessage.success;
};

const checkCreate: MessageCheckFunction<BorrowedCreate> = (body) => {
  const { bookDataId, userBorrowedId } = body;
  if (!isValidId(bookDataId) || (!isUndefined(userBorrowedId) && !isValidId(bookDataId))) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkUpdate: MessageCheckFunction<BorrowedUpdate> = (body) => {
  const { returned } = body;
  if (!isUndefined(returned) && !returned) {
    return CheckResultMessage.borrowInvalidReturned;
  }
  return CheckResultMessage.success;
};


export const checkBorrowedCreate: CheckFunction<BorrowedCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBorrowedCreate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCreate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};

export const checkBorrowedUpdate: CheckFunction<BorrowedUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isBorrowedUpdate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkUpdate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
