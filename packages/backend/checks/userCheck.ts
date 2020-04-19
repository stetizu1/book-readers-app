import {
  UserDataCreate, isUserDataCreate,
  UserDataUpdateWithPassword, isUserDataUpdate,
} from 'book-app-shared/types/UserData';
import { isValidEmail } from 'book-app-shared/helpers/validators';

import { CheckResultValue } from '../constants/errorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail, constructCheckResultSuccess } from '../helpers/constructCheckResult';


const checkCreate: MessageCheckFunction<UserDataCreate> = (body) => {
  const { email } = body;
  if (!isValidEmail(email)) {
    return CheckResultValue.invalidEmail;
  }
  return CheckResultValue.success;
};

export const checkUserCreate: CheckFunction<UserDataCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isUserDataCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};

export const checkUserUpdate: CheckFunction<UserDataUpdateWithPassword> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isUserDataUpdate(normalized)) {
    return constructCheckResultSuccess(normalized);
  }
  return constructCheckResultFail(CheckResultValue.invalidType, errPrefix, errPostfix);
};
