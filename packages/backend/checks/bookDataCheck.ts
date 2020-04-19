import {
  BookDataCreate, BookDataUpdate, isBookDataCreate, isBookDataUpdate,
} from 'book-app-shared/types/BookData';
import {
  isValidId, isValidIsbn, isValidYear,
} from 'book-app-shared/helpers/validators';

import {
  INVALID_ID, INVALID_ISBN, INVALID_STRUCTURE, INVALID_YEAR,
  BOOK_DATA_CAN_NOT_DELETE_USER,
} from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';


export const getCommonErrorMessage = (
  userId?: number | null,
  genreId?: number | null,
  yearPublished?: string | null,
  isbn?: string | null,
  labelsIds?: number[] | null,
): string | undefined => {
  if ((userId && !isValidId(userId))
    || (genreId && !isValidId(genreId))
    || (labelsIds && (labelsIds.some((id) => !isValidId(id))))
  ) {
    return INVALID_ID;
  }

  if (yearPublished && !isValidYear(yearPublished)) {
    return INVALID_YEAR;
  }

  if (isbn && !isValidIsbn(isbn)) {
    return INVALID_ISBN;
  }

  return undefined;
};

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

  if (!isValidId(bookId)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_ID),
    };
  }

  const errorMessage = getCommonErrorMessage(userId, genreId, yearPublished, isbn, labelsIds);

  if (errorMessage !== undefined) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, errorMessage),
    };
  }

  // validity of review and personal book data checked later in their own repository
  return {
    checked: normalizeCreateObject(body),
  };
};

export const checkBookDataUpdate: CheckFunction<BookDataUpdate> = (body, errPrefix, errPostfix) => {
  if (!isBookDataUpdate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  const {
    userId, yearPublished, isbn, genreId, labelsIds,
  } = body;

  const errorMessage = getCommonErrorMessage(userId, genreId, yearPublished, isbn, labelsIds);

  if (errorMessage !== undefined) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, errorMessage),
    };
  }

  if (userId === null) { // user can be null in database, but can not be set as a null
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, BOOK_DATA_CAN_NOT_DELETE_USER),
    };
  }

  return {
    checked: normalizeUpdateObject(body),
  };
};
