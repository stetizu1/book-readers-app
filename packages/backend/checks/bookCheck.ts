import { BookCreate, isBookCreate } from 'book-app-shared/types/Book';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction } from '../types/CheckResult';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResultFail, constructCheckResultSuccess } from '../helpers/checks/constructCheckResult';


export const checkBookCreate: CheckFunction<BookCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isBookCreate(normalized)) {
    return constructCheckResultSuccess(normalized);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
