import {
  BorrowedCreate, BorrowedUpdate, isBorrowedCreate, isBorrowedUpdate,
} from 'book-app-shared/types/Borrowed';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import {
  INVALID_DATE,
  INVALID_ID,
  INVALID_STRUCTURE,
  BORROW_SAME_ID_GIVEN,
  BORROW_INVALID_RETURNED,
} from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';


const getCommonErrorMessage = (userBorrowedId?: number | null, until?: string | null): string | undefined => {
  if (!isUndefined.or(isNull)(userBorrowedId) && !isValidId(userBorrowedId)) {
    return INVALID_ID;
  }

  if (!isUndefined.or(isNull)(until) && !isValidDate(until)) {
    return INVALID_DATE;
  }
  return undefined;
};

export const checkBorrowedCreate: CheckFunction<BorrowedCreate> = (body, errPrefix, errPostfix) => {
  if (!isBorrowedCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidId(body.userId) || !isValidId(body.bookDataId)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (body.userBorrowedId && body.userId === body.userBorrowedId) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, BORROW_SAME_ID_GIVEN),
    };
  }

  const errorMessage = getCommonErrorMessage(body.userBorrowedId, body.until);
  if (!isUndefined(errorMessage)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, errorMessage),
    };
  }

  return {
    checked: normalizeCreateObject(body),
  };
};

export const checkBorrowedUpdate: CheckFunction<BorrowedUpdate> = ((body, errPrefix, errPostfix) => {
  if (!isBorrowedUpdate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }

  if (!isUndefined(body.returned) && !body.returned) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, BORROW_INVALID_RETURNED),
    };
  }

  const errorMessage = getCommonErrorMessage(body.userBorrowedId, body.until);
  if (!isUndefined(errorMessage)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, errorMessage),
    };
  }

  return {
    checked: normalizeUpdateObject(body),
  };
});
