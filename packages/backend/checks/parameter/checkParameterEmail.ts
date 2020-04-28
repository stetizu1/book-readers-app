import { isString } from 'book-app-shared/helpers/typeChecks';
import { isValidEmail } from 'book-app-shared/helpers/validators';

import { InvalidParametersErrorMessage } from '../../constants/ErrorMessages';
import { InvalidParametersError } from '../../types/http_errors/InvalidParametersError';

export const checkParameterEmail = (email: string | number): string => {
  if (!isString(email) || !isValidEmail(email)) {
    throw new InvalidParametersError(InvalidParametersErrorMessage.invalidPathEmail);
  }
  return email;
};
