import {
  BorrowedCreate, BorrowedUpdate, isBorrowedCreate, isBorrowedUpdate,
} from 'book-app-shared/types/Borrowed';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage, Success } from '../../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../../helpers/checks/constructCheckResult';


const checkCommon: CheckFunction<BorrowedCreate | BorrowedUpdate> = (body) => {
  const { userBorrowedId, until } = body;
  if (!isUndefined.or(isNull)(userBorrowedId) && !isValidId(userBorrowedId)) {
    return InvalidParametersErrorMessage.invalidId;
  }

  if (!isUndefined.or(isNull)(until) && !isValidDate(until)) {
    return InvalidParametersErrorMessage.invalidDate;
  }
  return Success.checkSuccess;
};

const checkCreate: CheckFunction<BorrowedCreate> = (body) => {
  const { bookDataId, userBorrowedId } = body;
  if (!isValidId(bookDataId) || (!isUndefined(userBorrowedId) && !isValidId(bookDataId))) {
    return InvalidParametersErrorMessage.invalidId;
  }
  return Success.checkSuccess;
};

const checkUpdate: CheckFunction<BorrowedUpdate> = (body) => {
  const { returned } = body;
  if (!isUndefined(returned) && !returned) {
    return InvalidParametersErrorMessage.borrowInvalidReturned;
  }
  return Success.checkSuccess;
};


export const checkBorrowedCreate: ExportedCheckFunction<BorrowedCreate> = (body) => (
  executeCheckCreate(body, isBorrowedCreate, checkCommon, checkCreate)
);

export const checkBorrowedUpdate: ExportedCheckFunction<BorrowedUpdate> = (body) => (
  executeCheckUpdate(body, isBorrowedUpdate, checkCommon, checkUpdate)
);
