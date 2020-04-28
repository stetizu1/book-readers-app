import { isNumber } from 'book-app-shared/helpers/typeChecks';
import { isValidId } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage } from '../../constants/ErrorMessages';
import { InvalidParametersError } from '../../types/http_errors/InvalidParametersError';


export const checkParameterId = (param: string | number): number => {
  if (!isNumber(param) || !isValidId(param)) {
    throw new InvalidParametersError(InvalidParametersErrorMessage.invalidPathId);
  }
  return param;
};
