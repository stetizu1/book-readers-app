import { BookCreate, isBookCreate } from 'book-app-shared/types/Book';

import { EMPTY_STRING, INVALID_STRUCTURE } from '../constants/errorMessages';
import { isValidName } from '../helpers/validators';
import { getHttpError } from '../helpers/getHttpError';

export const checkBookCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<BookCreate> => {
  if (!isBookCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidName(body.name)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, EMPTY_STRING),
    };
  }

  return {
    checked: body,
  };
};
