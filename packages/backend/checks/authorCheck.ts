import { AuthorCreate, isAuthorCreate } from 'book-app-shared/types/Author';
import { isValidName } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { checkCreate } from '../helpers/checks/constructCheckResult';


const checkCreateWithMessage: MessageCheckFunction<AuthorCreate> = (body) => {
  if (!isValidName(body.name)) {
    return CheckResultMessage.invalidName;
  }
  return CheckResultMessage.success;
};

export const checkAuthorCreate: CheckFunction<AuthorCreate> = (body, errPrefix, errPostfix) => (
  checkCreate(isAuthorCreate, checkCreateWithMessage, body, errPrefix, errPostfix)
);
