import { BookCreate, isBookCreate } from 'book-app-shared/types/Book';

import { EMPTY_STRING, INVALID_STRUCTURE } from '../constants/errorMessages';
import { isValidName } from '../helpers/validators';

export const checkBookCreate = (body: unknown): CheckResult<BookCreate> => {
  if (!isBookCreate(body)) {
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
