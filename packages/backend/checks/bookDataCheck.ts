import { BookDataCreate, isBookDataCreate } from 'book-app-shared/types/BookData';
import {
  isValidId, isValidIsbn, isValidYear,
} from 'book-app-shared/helpers/validators';

import {
  INVALID_ID, INVALID_ISBN, INVALID_STRUCTURE, INVALID_YEAR,
} from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';


export const checkBookDataCreate: CheckFunction<BookDataCreate> = (body, errPrefix, errPostfix) => {
  if (!isBookDataCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }

  const {
    bookId, userId, yearPublished, isbn, genreId, labelsIds,
  } = body;

  if (!isValidId(bookId)
    || (genreId && !isValidId(genreId))
    || (labelsIds && (labelsIds.find((id) => !isValidId(id))) !== undefined)
  ) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (userId && !isValidId(userId)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  if (yearPublished && !isValidYear(yearPublished)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_YEAR),
    };
  }

  if (isbn && !isValidIsbn(isbn)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ISBN),
    };
  }

  // validity of review and personal book data checked later in their own repository
  return {
    checked: normalizeCreateObject(body),
  };
};
