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

import { CheckResultMessage } from '../../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../../helpers/checks/constructCheckResult';


const checkCommon: CheckFunction<BookDataCreate | BookDataCreateFromBookRequest | BookDataUpdate> = (body) => {
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

const checkCommonCreateUpdate: CheckFunction<BookDataCreate | BookDataUpdate> = (body) => {
  const { labelsIds } = body;
  if (!isUndefined.or(isNull)(labelsIds)
    && (labelsIds.some((id) => !isValidId(id)))
  ) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkCreateCommon: CheckFunction<BookDataCreate | BookDataCreateFromBookRequest> = (body) => {
  const { bookId } = body;
  if (!isValidId(bookId)) {
    return CheckResultMessage.invalidId;
  }
  return CheckResultMessage.success;
};

const checkUpdate: CheckFunction<BookDataUpdate> = (body) => {
  const { userId } = body;
  if (isNull(userId)) { // user can be null in database, but can not be set as a null
    return CheckResultMessage.bookDataCanNotDeleteUser;
  }
  return CheckResultMessage.success;
};


export const checkBookDataCreate: ExportedCheckFunction<BookDataCreate> = (body) => (
  executeCheckCreate(body, isBookDataCreate, checkCreateCommon, checkCommonCreateUpdate, checkCommon)
);

export const checkBookDataCreateFromBookRequest: ExportedCheckFunction<BookDataCreateFromBookRequest> = (body) => (
  executeCheckCreate(body, isBookDataCreateFromBookRequest, checkCreateCommon, checkCommon)
);

export const checkBookDataUpdate: ExportedCheckFunction<BookDataUpdate> = (body) => (
  executeCheckUpdate(body, isBookDataUpdate, checkUpdate, checkCommonCreateUpdate, checkCommon)
);
