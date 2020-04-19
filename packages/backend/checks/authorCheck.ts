import { AuthorCreate, isAuthorCreate } from 'book-app-shared/types/Author';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResultFail, constructCheckResultSuccess } from '../helpers/constructCheckResult';


export const checkAuthorCreate: CheckFunction<AuthorCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isAuthorCreate(normalized)) {
    return constructCheckResultSuccess(normalized);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
