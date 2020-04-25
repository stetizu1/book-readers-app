import {
  UserCreate, isUserCreate,
  UserUpdateWithPassword, isUserUpdate,
} from 'book-app-shared/types/User';
import { isValidEmail } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { MessageCheckFunction, CheckFunction } from '../types/CheckResult';
import { checkCreate, checkUpdate } from '../helpers/checks/constructCheckResult';


const checkCreateWithMessage: MessageCheckFunction<UserCreate> = (body) => {
  const { email } = body;
  if (!isValidEmail(email)) {
    return CheckResultMessage.invalidEmail;
  }
  return CheckResultMessage.success;
};

export const checkUserCreate: CheckFunction<UserCreate> = (body, errPrefix, errPostfix) => (
  checkCreate(isUserCreate, checkCreateWithMessage, body, errPrefix, errPostfix)
);

export const checkUserUpdate: CheckFunction<UserUpdateWithPassword> = (body, errPrefix, errPostfix) => (
  checkUpdate(isUserUpdate, undefined, body, errPrefix, errPostfix)
);
