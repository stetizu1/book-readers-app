import { BorrowedCreate, isBorrowedCreate } from 'book-app-shared/types/Borrowed';
import { isValidDate, isValidId } from 'book-app-shared/helpers/validators';

import {
  INVALID_DATE,
  INVALID_ID,
  INVALID_STRUCTURE,
} from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';


export const checkBookRequestCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<BorrowedCreate> => {
  if (!isBorrowedCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidId(body.userId) || !isValidId(body.bookId) || (body.userBorrowedId && !isValidId(body.userBorrowedId))) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (body.until && !isValidDate(body.until)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_DATE),
    };
  }

  // switch possibly empty to undefined
  return {
    checked: {
      ...body,
      nonUserName: body.nonUserName || undefined,
      comment: body.comment || undefined,
      until: body.until || undefined,
    },
  };
};
