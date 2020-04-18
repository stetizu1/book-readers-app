import { AuthorCreate, isAuthorCreate } from 'book-app-shared/types/Author';
import { isValidName } from 'book-app-shared/helpers/validators';

import { EMPTY_STRING, INVALID_STRUCTURE } from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';


export const checkAuthorCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<AuthorCreate> => {
  if (!isAuthorCreate(body)) {
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
