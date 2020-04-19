import {
  BookDataCreate, BookDataUpdate, isBookDataCreate, isBookDataUpdate,
} from 'book-app-shared/types/BookData';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId, isValidIsbn, isValidYear } from 'book-app-shared/helpers/validators';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/constructCheckResult';
import { checkMultiple } from '../helpers/checkMultiple';

const checkCommon: MessageCheckFunction<BookDataCreate | BookDataUpdate> = (body) => {
  const {
    userId, genreId, labelsIds,
    yearPublished,
    isbn,
  } = body;
  if ((!isUndefined.or(isNull)(userId) && !isValidId(userId))
    || (!isUndefined.or(isNull)(genreId) && !isValidId(genreId))
    || (!isUndefined.or(isNull)(labelsIds) && (labelsIds.some((id) => !isValidId(id))))) {
    return CheckResultValue.invalidId;
  }
  if (!isUndefined.or(isNull)(yearPublished) && !isValidYear(yearPublished)) {
    return CheckResultValue.invalidYear;
  }
  if (!isUndefined.or(isNull)(isbn) && !isValidIsbn(isbn)) {
    return CheckResultValue.invalidIsbn;
  }
  return CheckResultValue.success;
};

const checkCreate: MessageCheckFunction<BookDataCreate> = (body) => {
  const { bookId } = body;
  if (!isValidId(bookId)) {
    return CheckResultValue.invalidId;
  }
  return CheckResultValue.success;
};

const checkUpdate: MessageCheckFunction<BookDataUpdate> = (body) => {
  const { userId } = body;
  if (isNull(userId)) { // user can be null in database, but can not be set as a null
    return CheckResultValue.bookDataCanNotDeleteUser;
  }
  return CheckResultValue.success;
};

export const checkBookDataCreate: CheckFunction<BookDataCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBookDataCreate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCreate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};

export const checkBookDataUpdate: CheckFunction<BookDataUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isBookDataUpdate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkUpdate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
