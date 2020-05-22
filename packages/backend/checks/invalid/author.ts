import { AuthorCreate, isAuthorCreate } from 'book-app-shared/types/Author';
import { isValidName } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage, Success } from '../../constants/ErrorMessages';
import { ExportedCheckFunction, CheckFunction } from '../../types/CheckResult';
import { executeCheckCreate } from '../../helpers/checks/constructCheckResult';


const checkCreate: CheckFunction<AuthorCreate> = (body) => {
  if (!isValidName(body.name)) {
    return InvalidParametersErrorMessage.invalidName;
  }
  return Success.checkSuccess;
};

export const checkAuthorCreate: ExportedCheckFunction<AuthorCreate> = (body) => (
  executeCheckCreate(body, isAuthorCreate, checkCreate)
);
