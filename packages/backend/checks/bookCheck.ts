import { BookCreate, isBookCreate } from 'book-app-shared/types/Book';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResultFail, constructCheckResultSuccess } from '../helpers/constructCheckResult';


export const checkBookCreate: CheckFunction<BookCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBookCreate(normalized)) {
    return constructCheckResultSuccess(normalized);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
