import { isValidId } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage } from '../../constants/ErrorMessages';
import { InvalidParametersError } from '../../types/http-errors/InvalidParametersError';


export const checkParameterId = (param: string | number): number => {
  if (!isValidId(param)) {
    throw new InvalidParametersError(InvalidParametersErrorMessage.invalidPathId);
  }
  return Number(param);
};
