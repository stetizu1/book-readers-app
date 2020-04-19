import { BorrowedCreate, isBorrowedCreate } from 'book-app-shared/types/Borrowed';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import {
  INVALID_DATE,
  INVALID_ID,
  INVALID_STRUCTURE,
  BORROW_SAME_ID_GIVEN,
} from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';


export const checkBorrowedCreate: CheckFunction<BorrowedCreate> = (body, errPrefix, errPostfix) => {
  if (!isBorrowedCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidId(body.userId) || !isValidId(body.bookDataId) || (body.userBorrowedId && !isValidId(body.userBorrowedId))) {
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

  if (body.until && !isValidDate(body.until)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_DATE),
    };
  }

  return {
    checked: normalizeCreateObject(body),
  };
};
