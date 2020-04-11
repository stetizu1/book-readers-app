import { AuthorCreate, isAuthorCreate } from 'book-app-shared/types/Author';

import { EMPTY_STRING, INVALID_STRUCTURE } from '../constants/errorMessages';
import { isValidName } from '../helpers/validators';


export const checkAuthorCreate = (body: unknown): CheckResult<AuthorCreate> => {
  if (!isAuthorCreate(body)) {
    return {
      checked: false,
      message: `${INVALID_STRUCTURE}`,
    };
  }
  if (!isValidName(body.name)) {
    return {
      checked: false,
      message: `${EMPTY_STRING}`,
    };
  }
  return {
    checked: body,
  };
};
