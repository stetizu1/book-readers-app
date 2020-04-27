import { isValidEmail } from 'book-app-shared/helpers/validators';

import { ForbiddenMessage } from '../../constants/ErrorMessages';
import { ForbiddenError } from '../../types/http_errors/ForbiddenError';

export const authCheckValidEmail = (email: string): string => {
  if (!isValidEmail(email)) {
    throw new ForbiddenError(ForbiddenMessage.invalidTokenFormat);
  }
  return email;
};
