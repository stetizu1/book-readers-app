import { UserDataCreate, isUserDataCreate } from 'book-app-shared/types/UserData';
import { isValidEmail } from 'book-app-shared/helpers/validators';

import { INVALID_EMAIL, INVALID_STRUCTURE } from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';


export const checkUserCreate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<UserDataCreate> => {
  if (!isUserDataCreate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }
  if (!isValidEmail(body.email)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_EMAIL),
    };
  }

  // switch possibly empty to undefined
  return {
    checked: {
      ...body,
      password: body.password || undefined,
      name: body.name || undefined,
      description: body.description || undefined,
      image: body.image || undefined,
    },
  };
};
