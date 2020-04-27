import { HasLabel, isHasLabel } from 'book-app-shared/types/HasLabel';
import { isValidId } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage, Success } from '../../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../../types/CheckResult';
import { executeCheckCreate } from '../../helpers/checks/constructCheckResult';


const check: CheckFunction<HasLabel> = (body) => {
  const { bookDataId, labelId } = body;
  if (!isValidId(bookDataId) || !isValidId(labelId)) {
    return InvalidParametersErrorMessage.invalidId;
  }
  return Success.checkSuccess;
};

export const checkHasLabel: ExportedCheckFunction<HasLabel> = (body) => (
  executeCheckCreate(body, isHasLabel, check)
);
