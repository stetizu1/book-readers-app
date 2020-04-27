import {
  BorrowedCreate, BorrowedUpdate, isBorrowedCreate, isBorrowedUpdate,
} from 'book-app-shared/types/Borrowed';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../helpers/checks/constructCheckResult';


const checkCommon: CheckFunction<BorrowedCreate | BorrowedUpdate> = (body) => {
  const { userBorrowedId, until } = body;
  if (!isUndefined.or(isNull)(userBorrowedId) && !isValidId(userBorrowedId)) {
    return CheckResultMessage.invalidId;
  }

  if (!isUndefined.or(isNull)(until) && !isValidDate(until)) {
    return CheckResultMessage.invalidDate;
  }
  return CheckResultMessage.success;
};

const checkCreate: CheckFunction<BorrowedCreate> = (body) => {
  const { bookDataId, userBorrowedId } = body;
  if (!isValidId(bookDataId) || (!isUndefined(userBorrowedId) && !isValidId(bookDataId))) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkUpdate: CheckFunction<BorrowedUpdate> = (body) => {
  const { returned } = body;
  if (!isUndefined(returned) && !returned) {
    return CheckResultMessage.borrowInvalidReturned;
  }
  return CheckResultMessage.success;
};


export const checkBorrowedCreate: ExportedCheckFunction<BorrowedCreate> = (body, errPrefix, errPostfix) => (
  executeCheckCreate(body, errPrefix, errPostfix, isBorrowedCreate, checkCommon, checkCreate)
);

export const checkBorrowedUpdate: ExportedCheckFunction<BorrowedUpdate> = (body, errPrefix, errPostfix) => (
  executeCheckUpdate(body, errPrefix, errPostfix, isBorrowedUpdate, checkCommon, checkUpdate)
);
