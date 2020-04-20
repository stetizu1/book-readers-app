import {
  BookDataCreate, BookDataCreateFromBookRequest, BookDataUpdate,
  isBookDataCreate, isBookDataCreateFromBookRequest, isBookDataUpdate,
} from 'book-app-shared/types/BookData';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId, isValidIsbn, isValidYear } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail } from '../helpers/checks/constructCheckResult';
import { checkMultiple } from '../helpers/checks/checkMultiple';


const checkCommon: MessageCheckFunction<BookDataCreate | BookDataCreateFromBookRequest | BookDataUpdate> = (body) => {
  const { genreId, yearPublished, isbn } = body;
  if (!isUndefined.or(isNull)(genreId) && !isValidId(genreId)) {
    return CheckResultMessage.invalidId;
  }
  if (!isUndefined.or(isNull)(yearPublished) && !isValidYear(yearPublished)) {
    return CheckResultMessage.invalidYear;
  }
  if (!isUndefined.or(isNull)(isbn) && !isValidIsbn(isbn)) {
    return CheckResultMessage.invalidIsbn;
  }
  return CheckResultMessage.success;
};

const checkCommonCreateUpdate: MessageCheckFunction<BookDataCreate | BookDataUpdate> = (body) => {
  const {
    userId, labelsIds,
  } = body;
  if ((!isUndefined.or(isNull)(userId) && !isValidId(userId))
    || (!isUndefined.or(isNull)(labelsIds) && (labelsIds.some((id) => !isValidId(id))))) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkCreate: MessageCheckFunction<BookDataCreate | BookDataCreateFromBookRequest> = (body) => {
  const { bookId } = body;
  if (!isValidId(bookId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkUpdate: MessageCheckFunction<BookDataUpdate> = (body) => {
  const { userId } = body;
  if (isNull(userId)) { // user can be null in database, but can not be set as a null
    return CheckResultMessage.bookDataCanNotDeleteUser;
  }
  return CheckResultMessage.success;
};


export const checkBookDataCreate: CheckFunction<BookDataCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBookDataCreate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCommonCreateUpdate, checkCreate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};

export const checkBookDataCreateFromBookRequest: CheckFunction<BookDataCreateFromBookRequest> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBookDataCreateFromBookRequest(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCreate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};

export const checkBookDataUpdate: CheckFunction<BookDataUpdate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isBookDataUpdate(normalized)) {
    const result = checkMultiple(normalized, checkCommon, checkCommonCreateUpdate, checkUpdate);
    return constructCheckResult(normalized, result, errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
