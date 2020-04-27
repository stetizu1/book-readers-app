import { isValidId } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage } from '../../constants/ErrorMessages';
import { InvalidParametersError } from '../../types/http_errors/InvalidParametersError';

export const checkParameterId = (param: string | number): number => {
  const id = Number(param);
  if (!isValidId(id)) {
    throw new InvalidParametersError(InvalidParametersErrorMessage.invalidPathId);
  }
  return id;
};
