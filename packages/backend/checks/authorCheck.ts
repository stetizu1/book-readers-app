import { AuthorCreate, isAuthorCreate } from 'book-app-shared/types/Author';

import { EMPTY_STRING, INVALID_STRUCTURE } from '../constants/errorMessages';
import { isValidName } from '../helpers/validators';
import { getHttpError } from '../helpers/getHttpError';


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
    checked: body,
  };
};
