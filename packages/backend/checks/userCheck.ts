import {
  UserDataCreate, isUserDataCreate,
  UserDataUpdateWithPassword, isUserDataUpdate,
} from 'book-app-shared/types/UserData';
import { isValidEmail } from 'book-app-shared/helpers/validators';

import { INVALID_EMAIL, INVALID_STRUCTURE } from '../constants/errorMessages';
import { CheckFunction } from '../types/CheckResult';
import { getHttpError } from '../helpers/getHttpError';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';


export const checkUserCreate: CheckFunction<UserDataCreate> = (body, errPrefix, errPostfix) => {
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

export const checkUserUpdate: CheckFunction<UserDataUpdateWithPassword> = (body, errPrefix, errPostfix) => {
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
