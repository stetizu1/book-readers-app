import { AuthorCreate, isAuthorCreate } from 'book-app-shared/types/Author';
import { isValidName } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { ExportedCheckFunction, CheckFunction } from '../types/CheckResult';
import { executeCheckCreate } from '../helpers/checks/constructCheckResult';


const checkCreate: CheckFunction<AuthorCreate> = (body) => {
  if (!isValidName(body.name)) {
    return CheckResultMessage.invalidName;
  }
  return CheckResultMessage.success;
};

export const checkAuthorCreate: ExportedCheckFunction<AuthorCreate> = (body, errPrefix, errPostfix) => (
  executeCheckCreate(body, errPrefix, errPostfix, isAuthorCreate, checkCreate)
);
