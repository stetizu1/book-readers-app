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

import { InvalidParametersErrorMessage, Success } from '../../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../../helpers/checks/constructCheckResult';


const checkCommon: CheckFunction<BookDataCreate | BookDataCreateFromBookRequest | BookDataUpdate> = (body) => {
  const { genreId, yearPublished, isbn } = body;
  if (!isUndefined.or(isNull)(genreId) && !isValidId(genreId)) {
    return InvalidParametersErrorMessage.invalidId;
  }
  if (!isUndefined.or(isNull)(yearPublished) && !isValidYear(yearPublished)) {
    return InvalidParametersErrorMessage.invalidYear;
  }
  if (!isUndefined.or(isNull)(isbn) && !isValidIsbn(isbn)) {
    return InvalidParametersErrorMessage.invalidIsbn;
  }
  return Success.checkSuccess;
};

const checkCommonCreateUpdate: CheckFunction<BookDataCreate | BookDataUpdate> = (body) => {
  const { labelsIds } = body;
  if (!isUndefined.or(isNull)(labelsIds)
    && (labelsIds.some((id) => !isValidId(id)))
  ) {
    return InvalidParametersErrorMessage.invalidId;
  }
  return Success.checkSuccess;
};

const checkCreateCommon: CheckFunction<BookDataCreate | BookDataCreateFromBookRequest> = (body) => {
  const { bookId } = body;
  if (!isValidId(bookId)) {
    return InvalidParametersErrorMessage.invalidId;
  }
  return Success.checkSuccess;
};


export const checkBookDataCreate: ExportedCheckFunction<BookDataCreate> = (body) => (
  executeCheckCreate(body, isBookDataCreate, checkCreateCommon, checkCommonCreateUpdate, checkCommon)
);

export const checkBookDataCreateFromBookRequest: ExportedCheckFunction<BookDataCreateFromBookRequest> = (body) => (
  executeCheckCreate(body, isBookDataCreateFromBookRequest, checkCreateCommon, checkCommon)
);

export const checkBookDataUpdate: ExportedCheckFunction<BookDataUpdate> = (body) => (
  executeCheckUpdate(body, isBookDataUpdate, checkCommonCreateUpdate, checkCommon)
);
