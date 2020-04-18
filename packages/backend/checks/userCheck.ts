import {
  UserDataCreate, isUserDataCreate,
  UserDataUpdateWithPassword, isUserDataUpdate,
} from 'book-app-shared/types/UserData';
import { isValidEmail } from 'book-app-shared/helpers/validators';

import { INVALID_EMAIL, INVALID_STRUCTURE } from '../constants/errorMessages';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';


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

  return {
    checked: normalizeCreateObject(body),
  };
};

export const checkUserUpdate = (body: unknown, errPrefix: string, errPostfix: string): CheckResult<UserDataUpdateWithPassword> => {
  if (!isUserDataUpdate(body)) {
    return {
      checked: false,
      checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, INVALID_STRUCTURE),
    };
  }

  return {
    checked: normalizeUpdateObject(body),
  };
};
