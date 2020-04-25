import { AuthorCreate, isAuthorCreate } from 'book-app-shared/types/Author';
import { isValidName } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject } from '../helpers/db/normalizeStructure';
import {
  constructCheckResult,
  constructCheckResultFail,
} from '../helpers/checks/constructCheckResult';


const checkCreate: MessageCheckFunction<AuthorCreate> = (body) => {
  if (!isValidName(body.name)) {
    return CheckResultMessage.invalidName;
  }
  return CheckResultMessage.success;
};

export const checkAuthorCreate: CheckFunction<AuthorCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isAuthorCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
