import { AuthorCreate, isAuthorCreate } from 'book-app-shared/types/Author';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction } from '../types/CheckResult';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResultFail, constructCheckResultSuccess } from '../helpers/checks/constructCheckResult';


export const checkAuthorCreate: CheckFunction<AuthorCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isAuthorCreate(normalized)) {
    return constructCheckResultSuccess(normalized);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
