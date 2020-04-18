import { BookCreate, isBookCreate } from 'book-app-shared/types/Book';
import { isValidName } from 'book-app-shared/helpers/validators';

import { EMPTY_STRING, INVALID_STRUCTURE } from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';


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
    checked: normalizeCreateObject(body),
  };
};
