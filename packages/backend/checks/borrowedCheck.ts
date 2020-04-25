import {
  BorrowedCreate, BorrowedUpdate, isBorrowedCreate, isBorrowedUpdate,
} from 'book-app-shared/types/Borrowed';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { MessageCheckFunction, CheckFunction } from '../types/CheckResult';
import { checkCreate, checkUpdate } from '../helpers/checks/constructCheckResult';
import { checkMultiple } from '../helpers/checks/checkMultiple';


const checkCommonWithMessage: MessageCheckFunction<BorrowedCreate | BorrowedUpdate> = (body) => {
  const { userBorrowedId, until } = body;
  if (!isUndefined.or(isNull)(userBorrowedId) && !isValidId(userBorrowedId)) {
    return CheckResultMessage.invalidId;
  }

  if (!isUndefined.or(isNull)(until) && !isValidDate(until)) {
    return CheckResultMessage.invalidDate;
  }
  return CheckResultMessage.success;
};

const checkCreateWithMessage: MessageCheckFunction<BorrowedCreate> = (body) => {
  const { bookDataId, userBorrowedId } = body;
  if (!isValidId(bookDataId) || (!isUndefined(userBorrowedId) && !isValidId(bookDataId))) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkUpdateWithMessage: MessageCheckFunction<BorrowedUpdate> = (body) => {
  const { returned } = body;
  if (!isUndefined(returned) && !returned) {
    return CheckResultMessage.borrowInvalidReturned;
  }
  return CheckResultMessage.success;
};


export const checkBorrowedCreate: CheckFunction<BorrowedCreate> = (body, errPrefix, errPostfix) => {
  const check = checkMultiple(checkCommonWithMessage, checkCreateWithMessage);
  return checkCreate(isBorrowedCreate, check, body, errPrefix, errPostfix);
};

export const checkBorrowedUpdate: CheckFunction<BorrowedUpdate> = (body, errPrefix, errPostfix) => {
  const check = checkMultiple(checkCommonWithMessage, checkUpdateWithMessage);
  return checkUpdate(isBorrowedUpdate, check, body, errPrefix, errPostfix);
};
