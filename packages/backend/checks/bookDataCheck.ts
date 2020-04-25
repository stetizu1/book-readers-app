import {
  BookDataCreate,
  BookDataCreateFromBookRequest,
  BookDataUpdate,
  isBookDataCreate,
  isBookDataCreateFromBookRequest,
  isBookDataUpdate,
} from 'book-app-shared/types/BookData';
import { isNull, isUndefined } from 'book-app-shared/helpers/typeChecks';
import { isValidId, isValidIsbn, isValidYear } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { MessageCheckFunction, CheckFunction } from '../types/CheckResult';
import { checkMultiple } from '../helpers/checks/checkMultiple';
import { checkCreate, checkUpdate } from '../helpers/checks/constructCheckResult';


const checkCommonWithMessage: MessageCheckFunction<BookDataCreate | BookDataCreateFromBookRequest | BookDataUpdate> = (body) => {
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

const checkCommonCreateUpdateWithMessage: MessageCheckFunction<BookDataCreate | BookDataUpdate> = (body) => {
  const {
    userId, labelsIds,
  } = body;
  if ((!isUndefined.or(isNull)(userId) && !isValidId(userId))
    || (!isUndefined.or(isNull)(labelsIds) && (labelsIds.some((id) => !isValidId(id))))) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkCreateCommonWithMessage: MessageCheckFunction<BookDataCreate | BookDataCreateFromBookRequest> = (body) => {
  const { bookId } = body;
  if (!isValidId(bookId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkUpdateWithMessage: MessageCheckFunction<BookDataUpdate> = (body) => {
  const { userId } = body;
  if (isNull(userId)) { // user can be null in database, but can not be set as a null
    return CheckResultMessage.bookDataCanNotDeleteUser;
  }
  return CheckResultMessage.success;
};


export const checkBookDataCreate: CheckFunction<BookDataCreate> = (body, errPrefix, errPostfix) => {
  const check = checkMultiple(checkCreateCommonWithMessage, checkCommonCreateUpdateWithMessage, checkCommonWithMessage);
  return checkCreate(isBookDataCreate, check, body, errPrefix, errPostfix);
};

export const checkBookDataCreateFromBookRequest: CheckFunction<BookDataCreateFromBookRequest> = (body, errPrefix, errPostfix) => {
  const check = checkMultiple(checkCreateCommonWithMessage, checkCommonWithMessage);
  return checkCreate(isBookDataCreateFromBookRequest, check, body, errPrefix, errPostfix);
};

export const checkBookDataUpdate: CheckFunction<BookDataUpdate> = (body, errPrefix, errPostfix) => {
  const check = checkMultiple(checkUpdateWithMessage, checkCommonCreateUpdateWithMessage, checkCommonWithMessage);
  return checkUpdate(isBookDataUpdate, check, body, errPrefix, errPostfix);
};
