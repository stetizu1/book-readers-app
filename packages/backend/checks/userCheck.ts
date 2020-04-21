import {
  UserCreate, isUserCreate,
  UserUpdateWithPassword, isUserUpdate,
} from 'book-app-shared/types/User';
import { isValidEmail } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, MessageCheckFunction } from '../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../helpers/db/normalizeStructure';
import { constructCheckResult, constructCheckResultFail, constructCheckResultSuccess } from '../helpers/checks/constructCheckResult';


const checkCreate: MessageCheckFunction<UserCreate> = (body) => {
  const { email } = body;
  if (!isValidEmail(email)) {
    return CheckResultMessage.invalidEmail;
  }
  return CheckResultMessage.success;
};

export const checkUserCreate: CheckFunction<UserCreate> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeCreateObject(body);
  if (isUserCreate(normalized)) {
    return constructCheckResult(normalized, checkCreate(normalized), errPrefix, errPostfix);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};

export const checkUserUpdate: CheckFunction<UserUpdateWithPassword> = (body, errPrefix, errPostfix) => {
  const normalized = normalizeUpdateObject(body);
  if (isUserUpdate(normalized)) {
    return constructCheckResultSuccess(normalized);
  }
  return constructCheckResultFail(CheckResultMessage.invalidType, errPrefix, errPostfix);
};
